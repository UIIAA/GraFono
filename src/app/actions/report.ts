"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getReports() {
    try {
        const reports = await db.report.findMany({
            include: {
                patient: true
            },
            orderBy: {
                date: 'desc'
            }
        });
        return { success: true, data: reports };
    } catch (error) {
        console.error("Error fetching reports:", error);
        return { success: false, error: "Failed to fetch reports" };
    }
}

export async function saveReport(data: any) {
    try {
        let report;
        if (data.id) {
            report = await db.report.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    date: new Date(data.date),
                    status: data.status,
                    type: data.type,
                    patientId: data.patientId,
                    content: data.content, // HTML/JSON content
                    fileUrl: data.fileUrl,
                    summary: data.summary // AI Summary
                }
            });
        } else {
            report = await db.report.create({
                data: {
                    title: data.title,
                    date: new Date(data.date),
                    status: data.status,
                    type: data.type,
                    patientId: data.patientId,
                    content: data.content,
                    fileUrl: data.fileUrl,
                    summary: data.summary
                }
            });
        }

        // Sync with KnowledgeBase
        // For reports, 'content' might be long, so we use 'summary' if available, otherwise a snippet of content
        const kbContent = `Relatório: ${report.title} (${report.type}). Resumo: ${data.summary || data.content || 'Sem conteúdo'}.`;

        await db.patientKnowledgeBase.create({
            data: {
                type: 'RELATORIO',
                content: kbContent,
                date: report.date,
                fileUrl: report.fileUrl,
                sourceId: report.id,
                patientId: report.patientId
            }
        });

        revalidatePath("/relatorios");
        return { success: true };
    } catch (error) {
        console.error("Error saving report:", error);
        return { success: false, error: "Failed to save report" };
    }
}
