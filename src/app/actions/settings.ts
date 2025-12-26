"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type AvailabilityData = {
    workingDays: string[];
    startHour: string;
    endHour: string;
    lunchStart?: string;
    lunchEnd?: string;
    sessionDuration: number;
};

export async function getAvailabilityConfig() {
    try {
        const config = await prisma.availabilityConfig.findFirst();
        if (!config) return null;
        return {
            ...config,
            workingDays: JSON.parse(config.workingDays) as string[]
        };
    } catch (error) {
        console.error("Error fetching availability:", error);
        return null;
    }
}

export async function saveAvailabilityConfig(data: AvailabilityData) {
    try {
        // Upsert logic (assuming single user/config for now)
        const existing = await prisma.availabilityConfig.findFirst();

        const payload = {
            workingDays: JSON.stringify(data.workingDays),
            startHour: data.startHour,
            endHour: data.endHour,
            lunchStart: data.lunchStart,
            lunchEnd: data.lunchEnd,
            sessionDuration: data.sessionDuration
        };

        if (existing) {
            await prisma.availabilityConfig.update({
                where: { id: existing.id },
                data: payload
            });
        } else {
            await prisma.availabilityConfig.create({
                data: payload
            });
        }

        revalidatePath("/financeiro");
        revalidatePath("/agenda");
        return { success: true };
    } catch (error) {
        console.error("Error saving availability:", error);
        return { success: false, error: "Failed to save settings" };
    }
}
