"use server";

import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveEvolution(data: {
    patientId: string;
    content: string;
    emotionalStatus?: string;
    type: string; // PARTICULAR or CONVENIO
    date: Date;
    fileUrl?: string; // Optional attachment
}) {
    try {
        const { patientId, content, emotionalStatus, type, date, fileUrl } = data;

        // 1. Save Evolution
        await prisma.evolution.create({
            data: {
                patientId,
                content,
                emotionalStatus,
                type,
                date: date,
                fileUrl
            }
        });

        // 2. Add to Patient Knowledge Base (AI indexing)
        await prisma.patientKnowledgeBase.create({
            data: {
                patientId,
                type: "EVOLUCAO",
                content: content,
                date: new Date(),
                sourceId: "EVOLUTION" // placeholder
            }
        });

        // 3. Red Flag Logic: Check if reevaluation is due
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            select: { nextReevaluation: true }
        });

        let redFlagWarning: string | null = null;
        if (patient?.nextReevaluation) {
            const today = new Date();
            // Reset time part for comparison
            today.setHours(0, 0, 0, 0);
            const due = new Date(patient.nextReevaluation);
            due.setHours(0, 0, 0, 0);

            if (due <= today) {
                redFlagWarning = "Sessão registrada. Lembre-se: o ciclo de reavaliação deste paciente venceu.";
            }
        }

        revalidatePath(`/pacientes/${patientId}`);
        revalidatePath(`/pacientes`);

        return { success: true, warning: redFlagWarning };
    } catch (error) {
        console.error("Failed to save evolution:", error);
        return { success: false, error: "Failed to save evolution" };
    }
}

export async function getEvolutions(patientId: string) {
    try {
        const evolutions = await prisma.evolution.findMany({
            where: { patientId },
            orderBy: { date: 'desc' },
            take: 20 // Recent ones
        });
        return { success: true, data: evolutions };
    } catch (error) {
        return { success: false, error: "Failed to fetch" };
    }
}

export async function getMonthlyFinancialStatus(patientId: string) {
    // Logic: Check if there's any pending INCOME transaction for this patient in the current month.
    // Ideally, for "MENSALIDADE", we check if there's a specific transaction.
    // For now, simpler logic:
    // If pending > 0 -> "Pendente"
    // Else -> "Pago" (Optimistic)

    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const pending = await prisma.transaction.count({
            where: {
                patientId,
                type: 'INCOME', // Assuming income
                status: { not: 'pago' }, // pendente, atrasado
                dueDate: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });

        return {
            status: pending > 0 ? "PENDING" : "PAID",
            message: pending > 0 ? "Mensalidade: Pendente" : "Mensalidade: Paga"
        };
    } catch (error) {
        return { status: "UNKNOWN", message: "Status financeiro indisponível" };
    }
}
