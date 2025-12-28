"use server";

import { db } from "@/lib/db";
import { startOfMonth, endOfMonth, addDays, startOfDay, endOfDay, isWeekend, eachDayOfInterval, subMonths, subDays, differenceInDays } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getFinancialMetrics(range?: { from: Date; to: Date }) {
    try {
        const today = new Date();

        // Determine Date Range
        const startCurrent = range?.from ? startOfDay(range.from) : startOfMonth(today);
        const endCurrent = range?.to ? endOfDay(range.to) : endOfMonth(today);

        // Determine Previous Period (Comparison)
        const daysDiff = differenceInDays(endCurrent, startCurrent) + 1;
        const startPrevious = subDays(startCurrent, daysDiff);
        const endPrevious = subDays(endCurrent, daysDiff);

        const next30Days = addDays(today, 30);

        // --- Helper: Get Metrics for a specific range ---
        async function fetchPeriodMetrics(start: Date, end: Date) {
            const transactions = await db.transaction.findMany({
                where: {
                    paymentDate: { gte: start, lte: end },
                    OR: [{ status: "PAID" }, { status: "PAGO" }, { status: "pago" }]
                }
            });

            const income = transactions
                .filter((t: any) => t.flow === "INCOME" || (!t.flow && t.amount > 0))
                .reduce((acc: number, t: any) => acc + t.amount, 0);

            const expenses = transactions
                .filter((t: any) => t.flow === "EXPENSE")
                .reduce((acc: number, t: any) => acc + t.amount, 0);

            return { income, expenses, netBalance: income - expenses };
        }

        // 1. Current Period Metrics
        const current = await fetchPeriodMetrics(startCurrent, endCurrent);

        // 2. Previous Period Metrics (for Delta)
        const previous = await fetchPeriodMetrics(startPrevious, endPrevious);

        // 3. Receivables Forecast (Previsão 30 dias) - Always from Today
        const pendingTransactions = await db.transaction.findMany({
            where: {
                status: { in: ["pendente", "PENDING", "AGENDADO"] },
                dueDate: { gte: today, lte: next30Days },
                flow: "INCOME"
            }
        });
        const receivablesTransactions = pendingTransactions.reduce((acc: number, t: any) => acc + t.amount, 0);

        const futureAppointments = await db.appointment.findMany({
            where: {
                date: { gte: today, lte: next30Days },
                status: "Agendado"
            },
            include: { patient: true }
        });

        let receivablesAppointments = 0;
        futureAppointments.forEach(apt => {
            const val = (apt.patient as any)?.negotiatedValue || 0; // Default to 0 to be conservative? Or 150?
            receivablesAppointments += val;
        });

        const forecast = receivablesTransactions + receivablesAppointments;

        // 4. Default Index (Inadimplência) - Global snapshot
        const overdueTransactions = await db.transaction.findMany({
            where: {
                OR: [
                    { status: "atrasado" },
                    { status: "OVERDUE" },
                    { status: { in: ["pendente", "PENDING"] }, dueDate: { lt: today } }
                ],
                flow: "INCOME"
            }
        });
        const defaultTotal = overdueTransactions.reduce((acc: number, t: any) => acc + t.amount, 0);

        // 5. Strategic Metrics: Occupancy & Ticket
        const realizedAppointments = await db.appointment.count({
            where: {
                date: { gte: startCurrent, lte: endCurrent },
                status: "Realizado"
            }
        });

        const avgTicket = realizedAppointments > 0 ? (current.income / realizedAppointments) : 0;

        // Occupancy Calculation
        const availabilityConfig = await db.availabilityConfig.findFirst();

        let totalCapacity = 0;
        if (availabilityConfig) {
            const daysInInterval = eachDayOfInterval({ start: startCurrent, end: endCurrent });

            // Granular Logic (Time Slots)
            if (availabilityConfig.timeSlots && availabilityConfig.timeSlots.length > 5) { // Simple check if JSON is likely populated
                const timeSlots = JSON.parse(availabilityConfig.timeSlots) as { day: string, active: boolean, slots: { start: string, end: string }[] }[];
                const dayMap: Record<number, string> = { 1: "MON", 2: "TUE", 3: "WED", 4: "THU", 5: "FRI", 6: "SAT", 0: "SUN" };

                daysInInterval.forEach(date => {
                    const dayId = dayMap[date.getDay()];
                    const dayConfig = timeSlots.find(d => d.day === dayId);

                    if (dayConfig && dayConfig.active) {
                        dayConfig.slots.forEach(slot => {
                            const [sH, sM] = slot.start.split(':').map(Number);
                            const [eH, eM] = slot.end.split(':').map(Number);
                            const startMins = sH * 60 + sM;
                            const endMins = eH * 60 + eM;

                            // Prevent negative if end < start (though UI validations should catch)
                            const diff = Math.max(0, endMins - startMins);

                            // Add hours
                            totalCapacity += diff / 60;
                        });
                    }
                });
            } else {
                // Legacy Logic (Fallback)
                const workingDaysList = JSON.parse(availabilityConfig.workingDays);
                const dayMap: Record<number, string> = { 1: "MON", 2: "TUE", 3: "WED", 4: "THU", 5: "FRI", 6: "SAT", 0: "SUN" };

                const validDays = daysInInterval.filter(d => workingDaysList.includes(dayMap[d.getDay()]));

                const startH = parseInt(availabilityConfig.startHour.split(":")[0]);
                const endH = parseInt(availabilityConfig.endHour.split(":")[0]);
                let dailyHours = endH - startH;

                if (availabilityConfig.lunchStart && availabilityConfig.lunchEnd) {
                    const lStart = parseInt(availabilityConfig.lunchStart.split(":")[0]);
                    const lEnd = parseInt(availabilityConfig.lunchEnd.split(":")[0]);
                    dailyHours -= (lEnd - lStart);
                }

                totalCapacity = validDays.length * dailyHours;
            }
        } else {
            const daysInInterval = eachDayOfInterval({ start: startCurrent, end: endCurrent });
            const workingDays = daysInInterval.filter(day => !isWeekend(day)).length;
            totalCapacity = workingDays * 8;
        }

        const occupiedCount = await db.appointment.count({
            where: {
                date: { gte: startCurrent, lte: endCurrent },
                status: { in: ["Agendado", "Confirmado", "Realizado"] }
            }
        });

        const durationHours = availabilityConfig?.sessionDuration ? (availabilityConfig.sessionDuration / 60) : 1;
        const occupiedHours = occupiedCount * durationHours;

        const occupancyRate = totalCapacity > 0 ? (occupiedHours / totalCapacity) * 100 : 0;

        return {
            success: true,
            data: {
                netBalance: current.netBalance,
                income: current.income,
                expenses: current.expenses,
                forecast,
                defaultTotal,
                period: {
                    start: startCurrent,
                    end: endCurrent
                },
                delta: {
                    income: previous.income > 0 ? ((current.income - previous.income) / previous.income) * 100 : 0,
                    expenses: previous.expenses > 0 ? ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0,
                },
                efficiency: {
                    avgTicket,
                    occupancyRate,
                    totalCapacity,
                    occupiedAppointments: occupiedCount
                }
            }
        };

    } catch (error) {
        console.error("Error calculating financial metrics:", error);
        return { success: false, error: "Failed to load financial metrics" };
    }
}

export async function getTransactions(filters?: any) {
    try {
        const where: any = {};
        if (filters?.status) where.status = filters.status;
        if (filters?.source) where.source = filters.source;

        // Date Range Filter
        if (filters?.from && filters?.to) {
            where.dueDate = {
                gte: filters.from,
                lte: filters.to
            };
        }

        const transactions = await db.transaction.findMany({
            where,
            orderBy: { dueDate: 'asc' },
            include: { patient: true }
        });

        return { success: true, data: transactions };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { success: false, error: "Failed to fetch transactions" };
    }
}

// --- Reminder Helpers ---

async function createGovBrReminder(patientId: string, amount: number, date: Date) {
    try {
        const patient = await db.patient.findUnique({ where: { id: patientId } });
        if (!patient) return;

        // Only for PARTICULAR patients
        if (patient.financialSource !== 'PARTICULAR') return;

        // Check if reminder already exists for this context? 
        // Ideally we link to transaction, but loosely coupled for now.
        // We set due date to date + 1 day.
        const dueDate = addDays(date, 1);

        await db.reminder.create({
            data: {
                title: `Gerar Recibo Gov.br: ${patient.name}`,
                description: `Valor: R$ ${amount.toFixed(2)}. Referente ao pagamento confirmado em ${date.toLocaleDateString('pt-BR')}.`,
                type: "RECIBO_GOV",
                priority: "HIGH",
                dueDate: dueDate,
                link: "https://www.gov.br/pt-br/servicos/emitir-nota-fiscal-de-servico-eletronica-nfs-e",
                patientId: patient.id
            }
        });
    } catch (e) {
        console.error("Error creating Gov.br reminder:", e);
    }
}

export async function saveTransaction(data: any) {
    try {
        const tx = await db.transaction.create({
            data: {
                description: data.description,
                amount: data.amount,
                type: data.type,
                flow: data.flow || "INCOME",
                category: data.category,
                source: data.source,
                status: data.status,
                dueDate: data.dueDate,
                paymentDate: (data.status === "PAID" || data.status === "PAGO" || data.status === "pago") ? new Date() : null,
                patientId: data.patientId // Optional now
            }
        });

        // Trigger Reminder if Paid + PatientId exists
        if (
            (data.status === "PAID" || data.status === "PAGO" || data.status === "pago") &&
            data.patientId
        ) {
            await createGovBrReminder(data.patientId, data.amount, new Date());
        }

        revalidatePath("/financeiro");
        return { success: true };
    } catch (error) {
        console.error("Error creating transaction:", error);
        return { success: false, error: "Failed to create transaction" };
    }
}

// ... existing code ...

export async function settleTransaction(id: string) {
    try {
        const tx = await db.transaction.update({
            where: { id },
            data: {
                status: "PAID",
                paymentDate: new Date()
            }
        });

        if (tx.patientId) {
            await createGovBrReminder(tx.patientId, tx.amount, new Date());
        }

        revalidatePath("/financeiro/adimplencia");
        revalidatePath("/financeiro");
        return { success: true };
    } catch (error) {
        console.error("Error settling transaction:", error);
        return { success: false, error: "Failed to settle transaction" };
    }
}

export async function undoSettlement(id: string) {
    try {
        await db.transaction.update({
            where: { id },
            data: {
                status: "PENDING",
                paymentDate: null
            }
        });
        revalidatePath("/financeiro/adimplencia");
        revalidatePath("/financeiro");
        return { success: true };
    } catch (error) {
        console.error("Error undoing settlement:", error);
        return { success: false, error: "Failed to undo settlement" };
    }
}


export async function getComplianceList(month: number, year: number) {
    try {
        const startDate = new Date(year, month, 1);
        const endDate = endOfMonth(startDate);
        const today = new Date();

        // Fetch transactions due in this month OR (pending/overdue ones from previous months? 
        // usually compliance list is for a specific period, but maybe we want all active issues?
        // Let's stick to the requested month for now, or maybe open items up to this month?)
        // The UI seems to navigate by month. Let's fetch for that month + any carry-over overdue?
        // For simplicity and matching typical "monthly closure" views, let's fetch:
        // 1. All transactions with dueDate in this month.
        // 2. (Optional) Maybe all overdue transactions regardless of date? 
        // Let's stick to the selected month's view based on the UI navigation.

        const transactions = await db.transaction.findMany({
            where: {
                dueDate: {
                    gte: startOfMonth(startDate),
                    lte: endDate
                },
                flow: "INCOME" // Usually compliance is about receiving money
            },
            include: {
                patient: true
            },
            orderBy: {
                dueDate: 'asc'
            }
        });

        // Compute compliance status
        const data = transactions.map((t: any) => {
            let complianceStatus = "WAITING";

            const isPaid = t.status === "PAID" || t.status === "PAGO" || t.status === "pago";
            const isOverdue = !isPaid && new Date(t.dueDate) < startOfDay(today);

            if (isPaid) {
                complianceStatus = "PAID";
            } else if (isOverdue) {
                complianceStatus = "OVERDUE";
            }

            return {
                ...t,
                complianceStatus
            };
        });

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching compliance list:", error);
        return { success: false, error: "Failed to fetch compliance list" };
    }
}

export async function generateMonthlyCharges(month: number, year: number) {
    try {
        const activeStatuses = ["Em tratamento", "Em Terapia", "Em Tratamento", "em_andamento"];
        const patients = await db.patient.findMany({
            where: {
                status: { in: activeStatuses },
                negotiatedValue: { gt: 0 }
            }
        });

        let count = 0;
        const dueDate = new Date(year, month, 10);

        for (const patient of patients) {
            const existing = await db.transaction.findFirst({
                where: {
                    patientId: patient.id,
                    dueDate: {
                        gte: startOfMonth(dueDate),
                        lte: endOfMonth(dueDate)
                    },
                    description: { contains: "Mensalidade" }
                }
            });

            if (!existing) {
                await db.transaction.create({
                    data: {
                        description: `Mensalidade - ${month + 1}/${year}`,
                        amount: patient.negotiatedValue || 0,
                        type: "Mensalidade",
                        flow: "INCOME",
                        category: "Consultas",
                        source: patient.financialSource || "PARTICULAR",
                        status: "PENDING",
                        dueDate: dueDate,
                        patientId: patient.id
                    }
                });
                count++;
            }
        }
        revalidatePath("/financeiro/adimplencia");
        return { success: true, count };
    } catch (error) {
        console.error("Error generating charges:", error);
        return { success: false, error: "Failed to generate charges" };
    }
}
