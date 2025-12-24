"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getExams() {
    try {
        const exams = await db.exam.findMany({
            include: {
                patient: true
            },
            orderBy: {
                date: 'desc'
            }
        });
        return { success: true, data: exams };
    } catch (error) {
        console.error("Error fetching exams:", error);
        return { success: false, error: "Failed to fetch exams" };
    }
}

export async function saveExam(data: any) {
    try {
        let exam;
        if (data.id) {
            exam = await db.exam.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    date: new Date(data.date),
                    status: data.status,
                    type: data.type,
                    patientId: data.patientId,
                    fileUrl: data.fileUrl,
                    summary: data.summary, // Notes as summary
                }
            });
        } else {
            exam = await db.exam.create({
                data: {
                    title: data.title,
                    date: new Date(data.date),
                    status: data.status,
                    type: data.type,
                    patientId: data.patientId,
                    fileUrl: data.fileUrl,
                    summary: data.summary,
                }
            });
        }

        // Sync with KnowledgeBase
        const content = `Exame: ${exam.title}. Tipo: ${exam.type}. Status: ${exam.status}. Obs: ${data.summary || 'Sem observações'}.`;

        await db.patientKnowledgeBase.create({
            data: {
                type: 'EXAME',
                content: content,
                date: exam.date,
                fileUrl: exam.fileUrl,
                sourceId: exam.id,
                patientId: exam.patientId
            }
        });

        revalidatePath("/exames");
        return { success: true };
    } catch (error) {
        console.error("Error saving exam:", error);
        return { success: false, error: "Failed to save exam" };
    }
}
