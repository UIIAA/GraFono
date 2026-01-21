"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { addMonths } from "date-fns";

export async function getAssessments() {
    try {
        const assessments = await db.assessment.findMany({
            include: {
                patient: true
            },
            orderBy: {
                date: 'desc'
            }
        });
        return { success: true, data: assessments };
    } catch (error) {
        console.error("Error fetching assessments:", error);
        return { success: false, error: "Failed to fetch assessments" };
    }
}

export async function saveAssessment(data: any) {
    try {
        let assessment;
        if (data.id) {
            assessment = await db.assessment.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    date: new Date(data.date),
                    status: data.status,
                    type: data.type,
                    patientId: data.patientId,
                    description: data.description,
                    fileUrl: data.fileUrl
                }
            });
        } else {
            assessment = await db.assessment.create({
                data: {
                    title: data.title || "Nova Avaliação",
                    date: new Date(data.date),
                    status: data.status,
                    type: data.type,
                    patientId: data.patientId,
                    description: data.description,
                    fileUrl: data.fileUrl
                }
            });
        }

        // Sync with KnowledgeBase
        const content = `Avaliação: ${assessment.title} (${assessment.type}). Detalhes: ${assessment.description || 'N/A'}`;

        await db.patientKnowledgeBase.create({
            data: {
                type: 'AVALIACAO',
                content: content,
                date: assessment.date,
                fileUrl: assessment.fileUrl,
                sourceId: assessment.id,
                patientId: assessment.patientId
            }
        });

        // Update Patient Reevaluation Dates
        const patient = await db.patient.findUnique({ where: { id: assessment.patientId } });
        if (patient) {
            let nextReevaluation: Date | null = null;
            if (patient.reevaluationInterval && patient.reevaluationInterval !== "NONE") {
                const intervalMap: Record<string, number> = {
                    "3_MONTHS": 3,
                    "6_MONTHS": 6,
                    "1_YEAR": 12
                };
                const months = intervalMap[patient.reevaluationInterval] || 0;
                if (months > 0) {
                    const baseline = new Date(assessment.date);
                    // addMonths from date-fns handles "Jan 31 + 1 month = Feb 28" correctly
                    nextReevaluation = addMonths(baseline, months);
                }
            }

            await db.patient.update({
                where: { id: patient.id },
                data: {
                    lastReevaluation: assessment.date,
                    nextReevaluation: nextReevaluation
                }
            });
        }

        revalidatePath("/avaliacoes");
        revalidatePath("/pacientes"); // Revalidate patient list for Kanban flags
        return { success: true };
    } catch (error) {
        console.error("Error saving assessment:", error);
        return { success: false, error: "Failed to save assessment" };
    }
}
