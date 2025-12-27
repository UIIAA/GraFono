"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getActiveReminders() {
    try {
        const reminders = await db.reminder.findMany({
            where: {
                isCompleted: false
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                patient: {
                    select: { name: true }
                }
            }
        });
        return { success: true, data: reminders };
    } catch (error) {
        console.error("Error fetching reminders:", error);
        return { success: false, error: "Failed to fetch reminders" };
    }
}

export async function completeReminder(id: string) {
    try {
        await db.reminder.update({
            where: { id },
            data: {
                isCompleted: true
            }
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error completing reminder:", error);
        return { success: false, error: "Failed to complete reminder" };
    }
}
