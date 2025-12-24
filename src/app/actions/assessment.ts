"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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

        revalidatePath("/avaliacoes");
        return { success: true };
    } catch (error) {
        console.error("Error saving assessment:", error);
        return { success: false, error: "Failed to save assessment" };
    }
}
