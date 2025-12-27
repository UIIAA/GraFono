"use server";

import { db } from "@/lib/db";
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
        const config = await db.availabilityConfig.findFirst();
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
        const existing = await db.availabilityConfig.findFirst();

        const payload = {
            workingDays: JSON.stringify(data.workingDays),
            startHour: data.startHour,
            endHour: data.endHour,
            lunchStart: data.lunchStart,
            lunchEnd: data.lunchEnd,
            sessionDuration: data.sessionDuration
        };

        if (existing) {
            await db.availabilityConfig.update({
                where: { id: existing.id },
                data: payload
            });
        } else {
            await db.availabilityConfig.create({
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

export async function getProfessionalProfile(userId: string) {
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { digitalSignature: true, crfa: true, specialty: true, address: true, name: true }
        });
        return user;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function saveProfessionalProfile(userId: string, data: {
    digitalSignature?: string;
    crfa?: string;
    specialty?: string;
    address?: string;
    name?: string;
}) {
    try {
        await db.user.update({
            where: { id: userId },
            data: data
        });
        revalidatePath("/modelos");
        return { success: true };
    } catch (error) {
        console.error("Error saving profile:", error);
        return { success: false, error: "Failed to save profile" };
    }
}
