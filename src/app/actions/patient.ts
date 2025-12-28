"use server";

import { db } from "@/lib/db"; // Assuming this is where prisma client is exported
import { revalidatePath } from "next/cache";
import { addMonths } from "date-fns";

export async function getPatients() {
    try {
        const patients = await db.patient.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                transactions: true,
                appointments: {
                    select: {
                        date: true,
                        status: true
                    }
                }
            }
        });

        const patientsWithProgress = patients.map(patient => {
            const cycleStart = patient.lastReevaluation || patient.startDate;
            const completedSessions = patient.appointments.filter(
                apt => apt.status === "Realizado" && new Date(apt.date) >= new Date(cycleStart)
            ).length;

            return {
                ...patient,
                progress: {
                    completedSessions,
                    cycleStart,
                }
            };
        });

        return { success: true, data: patientsWithProgress };
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
        // Logic to calculate nextReevaluation
        let nextReevaluation = null;
        if (rest.reevaluationInterval && rest.reevaluationInterval !== "NONE") {
            const intervalMap: Record<string, number> = {
                "3_MONTHS": 3,
                "6_MONTHS": 6,
                "1_YEAR": 12
            };
            const months = intervalMap[rest.reevaluationInterval] || 0;
            if (months > 0) {
                // Use lastReevaluation if available, otherwise use now (start of cycle)
                // If the user already has a nextReevaluation and we are just updating info, we might want to keep it?
                // For simplified logic: always recalculate from lastReevaluation or Now if interval changes? 
                // Let's rely on client passing or simple recalc.
                // Better: If we have a lastReevaluation, add months to it. If not, add to Now.
                // However, we don't have the existing record here easily without fetching.
                // Let's trust that if the client is saving, we can default to Now if no lastReevaluation exists or is provided.

                const baseline = rest.lastReevaluation ? new Date(rest.lastReevaluation) : new Date();
                // addMonths handles end-of-month edge cases correctly (e.g. Jan 31 + 1 month -> Feb 28/29)
                nextReevaluation = addMonths(baseline, months);
            }
        }

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

            // Reevaluation
            reevaluationInterval: rest.reevaluationInterval,
            responsibleEmail: rest.responsibleEmail,
            nextReevaluation: nextReevaluation,

            // Financial
            financialSource: rest.financialSource,
            insuranceName: rest.insuranceName,
            insuranceNumber: rest.insuranceNumber,
            authorizationStatus: rest.authorizationStatus,
            imageUrl: rest.imageUrl || null,
            // Note: lastReevaluation is typically updated by the Assessment module, not this form directly, 
            // but we can allow it if needed. For now, we only save what's common.
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
