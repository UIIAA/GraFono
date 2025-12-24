"use server";

import { db } from "@/lib/db"; // Assuming this is where prisma client is exported
import { revalidatePath } from "next/cache";

export async function getPatients() {
    try {
        const patients = await db.patient.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                transactions: true,
            }
        });
        return { success: true, data: patients };
    } catch (error) {
        console.error("Error fetching patients:", error);
        return { success: false, error: "Failed to fetch patients" };
    }
}

export async function savePatient(data: any) {
    try {
        const { id, ...rest } = data;

        // Map UI types to DB types if needed. 
        // Ensuring basic validation based on schema
        const patientData = {
            name: rest.name,
            email: rest.email || null,
            phone: rest.phone || null,
            dateOfBirth: rest.dob ? new Date(rest.dob) : new Date(), // Handle date conversion
            gender: "Não informado", // Default or add to UI
            status: rest.status || "Aguardando",
            motherName: rest.motherName,
            fatherName: rest.fatherName,
            address: rest.address,
            observations: rest.observations,
            negotiatedValue: rest.negotiatedValue ? parseFloat(rest.negotiatedValue) : null,
        };

        if (id && !id.startsWith("p")) { // Check if it's a real ID (cuid) not a temp 'p1'
            await db.patient.update({
                where: { id },
                data: patientData,
            });
        } else {
            await db.patient.create({
                data: patientData,
            });
        }

        revalidatePath("/pacientes");
        revalidatePath("/financeiro"); // Updates finance metrics if needed
        return { success: true };
    } catch (error) {
        console.error("Error saving patient:", error);
        return { success: false, error: "Failed to save patient" };
    }
}

export async function updatePatientStatus(id: string, newStatus: string) {
    try {
        await db.patient.update({
            where: { id },
            data: { status: newStatus }
        });
        revalidatePath("/pacientes");
        return { success: true };
    } catch (error) {
        console.error("Error updating patient status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function getPatientHistory(patientId: string) {
    try {
        const history = await db.patientHistory.findMany({
            where: { patientId },
            orderBy: { date: 'desc' }
        });
        return { success: true, data: history };
    } catch (error) {
        console.error("Error fetching patient history:", error);
        return { success: false, error: "Failed to fetch history" };
    }
}

export async function addPatientHistory(patientId: string, content: string) {
    try {
        await db.patientHistory.create({
            data: {
                patientId,
                content,
                date: new Date()
            }
        });
        revalidatePath("/pacientes");
        return { success: true };
    } catch (error) {
        console.error("Error adding patient history:", error);
        return { success: false, error: "Failed to add history" };
    }
}
