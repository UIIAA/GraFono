"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTransactions() {
    try {
        const transactions = await db.transaction.findMany({
            include: {
                patient: true
            },
            orderBy: {
                dueDate: 'desc'
            }
        });

        // Map to simplified structure if needed, or return raw and map in component
        // Component expects: id, patientName, description, type, value, status, date, dueDate
        return { success: true, data: transactions };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { success: false, error: "Failed to fetch transactions" };
    }
}

export async function saveTransaction(data: {
    description: string;
    amount: number;
    type: string;
    status: string;
    dueDate: Date;
    patientId: string;
}) {
    try {
        await db.transaction.create({
            data: {
                description: data.description,
                amount: data.amount,
                type: data.type,
                status: data.status,
                dueDate: data.dueDate,
                patientId: data.patientId
            }
        });
        revalidatePath("/financeiro");
        return { success: true };
    } catch (error) {
        console.error("Error creating transaction:", error);
        return { success: false, error: "Failed to create transaction" };
    }
}
