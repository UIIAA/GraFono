"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAppointments(startDate?: Date, endDate?: Date) {
    try {
        const whereClause: any = {};
        if (startDate && endDate) {
            whereClause.date = {
                gte: startDate,
                lte: endDate
            };
        }

        const appointments = await db.appointment.findMany({
            where: whereClause,
            include: {
                patient: true
            },
            orderBy: {
                date: 'asc'
            }
        });
        return { success: true, data: appointments };
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return { success: false, error: "Failed to fetch appointments" };
    }
}

export async function createAppointment(data: {
    date: Date;
    time: string;
    patientId: string;
    type: string;
    notes?: string;
}) {
    try {
        await db.appointment.create({
            data: {
                date: data.date,
                time: data.time,
                patientId: data.patientId,
                type: data.type,
                status: "Agendado", // Default
                notes: data.notes
            }
        });
        revalidatePath("/agenda");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error creating appointment:", error);
        return { success: false, error: "Failed to create appointment" };
    }
}

export async function deleteAppointment(id: string) {
    try {
        await db.appointment.delete({
            where: { id }
        });
        revalidatePath("/agenda");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error deleting appointment:", error);
        return { success: false, error: "Failed to delete appointment" };
    }
}

export async function updateAppointment(id: string, data: {
    date: Date;
    time: string;
    patientId: string;
    type: string;
    notes?: string;
    status?: string;
}) {
    try {
        await db.appointment.update({
            where: { id },
            data: {
                date: data.date,
                time: data.time,
                patientId: data.patientId,
                type: data.type,
                notes: data.notes,
                status: data.status
            }
        });
        revalidatePath("/agenda");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error updating appointment:", error);
        return { success: false, error: "Failed to update appointment" };
    }
}
