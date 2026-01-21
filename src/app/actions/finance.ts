"use server";

import { db } from "@/lib/db";
import { startOfMonth, endOfMonth, addDays, startOfDay, endOfDay, isWeekend, eachDayOfInterval, subDays, differenceInDays } from "date-fns";
import { revalidatePath } from "next/cache";

// --- Metric Helpers ---


export async function getFinancialMetrics(range?: { from: Date; to: Date }) {
    try {
        const today = startOfDay(new Date());

        // Determine Date Range - Default to Current Month (1st to Last Day)
        const startCurrent = range?.from ? startOfDay(range.from) : startOfMonth(today);
        const endCurrent = range?.to ? endOfDay(range.to) : endOfMonth(today);

        // Comparison Period (Previous Month)
        const daysDiff = differenceInDays(endCurrent, startCurrent) + 1;
        const startPrevious = subDays(startCurrent, daysDiff);
        const endPrevious = subDays(endCurrent, daysDiff);

        // Forecast Boundary: End of Current Month (User Rule: "Mês atual")
        const endOfCurrentMonth = endOfMonth(today);

        // --- Metric Helpers ---
        async function fetchCashFlow(start: Date, end: Date) {
            // "Lucro Real" / "Resultado Caixa" Logic:
            // STRICTLY (Paid Income) - (Paid Expenses)

            const incomeResult = await db.transaction.aggregate({
                _sum: { amount: true },
                where: {
                    paymentDate: { gte: start, lte: end },
                    OR: [{ status: "PAID" }, { status: "PAGO" }, { status: "pago" }],
                    flow: { in: ["INCOME", "Receita", "RECEITA", "receita"] }
                }
            });

            const expenseResult = await db.transaction.aggregate({
                _sum: { amount: true },
                where: {
                    paymentDate: { gte: start, lte: end },
                    OR: [{ status: "PAID" }, { status: "PAGO" }, { status: "pago" }],
                    flow: { in: ["EXPENSE", "Despesa", "DESPESA", "despesa"] }
                }
            });

            const income = Number(incomeResult._sum.amount || 0);
            const expenses = Number(expenseResult._sum.amount || 0);

            return { income, expenses, netBalance: income - expenses };
        }

        const [current, previous] = await Promise.all([
            fetchCashFlow(startCurrent, endCurrent),
            fetchCashFlow(startPrevious, endPrevious)
        ]);

        // 3. Forecast (Previsão) - Next 30 Days (Rolling Window)
        const forecastEnd = addDays(today, 30);

        // a) Pending Transactions (Income)
        const pendingTxResult = await db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                status: { in: ["pendente", "PENDING", "AGENDADO"] },
                dueDate: { gte: today, lte: forecastEnd }, // Rolling 30d
                flow: { in: ["INCOME", "Receita", "RECEITA", "receita"] }
            }
        });
        const receivablesTransactions = Number(pendingTxResult._sum.amount || 0);

        // b) Scheduled Appointments (Potential Revenue)
        // First, verify which patients ALREADY have a Monthly Transaction generated for this period.
        const monthlyTransactions = await db.transaction.findMany({
            where: {
                dueDate: { gte: startCurrent, lte: addDays(forecastEnd, 30) }, // Look ahead enough to find bills covering this period
                isMonthly: true
            },
            select: { patientId: true }
        });
        const monthlyPatientIds = new Set(monthlyTransactions.map(t => t.patientId).filter(Boolean));

        const futureAppointments = await db.appointment.findMany({
            where: {
                date: { gte: today, lte: forecastEnd },
                status: "Agendado"
            },
            select: {
                patientId: true,
                patient: {
                    select: {
                        paymentMethod: true,
                        category: true,
                        negotiatedValue: true,
                        id: true
                    }
                }
            }
        });

        const receivablesAppointments = futureAppointments.reduce((acc, apt: any) => {
            const patient = apt.patient;
            if (!patient) return acc;

            // Deduplication Rule:
            // 1. If patient has a "Monthly" transaction generated for this period, ignore appointments (revenue is in the transaction).
            // 2. If patient is configured as "MONTHLY" or "PARTNER", ignore appointments (assuming covered by monthly fee).

            const hasMonthlyBill = monthlyPatientIds.has(patient.id);
            const isMonthlyConfig = patient.paymentMethod === "MONTHLY" || patient.category === "PARTNER";

            if (hasMonthlyBill || isMonthlyConfig) {
                return acc;
            }

            // Otherwise (Per Session), add the session value
            return acc + (patient.negotiatedValue || 0);
        }, 0);

        const forecast = receivablesTransactions + receivablesAppointments;

        // 4. Default Index (Inadimplência)
        const overdueResult = await db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                OR: [
                    { status: "atrasado" },
                    { status: "OVERDUE" },
                    { status: { in: ["pendente", "PENDING"] }, dueDate: { lt: today } }
                ],
                flow: { in: ["INCOME", "Receita", "RECEITA", "receita"] }
            }
        });
        const defaultTotal = overdueResult._sum.amount || 0;

        // 5. Strategic Metrics
        const realizedAppointments = await db.appointment.count({
            where: {
                date: { gte: startCurrent, lte: endCurrent },
                status: { in: ["Realizado", "Confirmado", "Agendado"] } // Use all active statuses to avoid div/0 if status not updated
            }
        });

        // Ticket Médio: Revenue Realized / Appointments Realized
        // User Logic: "dividindo o número ... pelo valor" (Inverted in text, corrected to standard Value/Number)
        const avgTicket = realizedAppointments > 0 ? (current.income / realizedAppointments) : 0;

        // Occupancy Calculation
        const availabilityConfig = await db.availabilityConfig.findFirst();

        let totalCapacity = 0;
        if (availabilityConfig) {
            const daysInInterval = eachDayOfInterval({ start: startCurrent, end: endCurrent });

            if (availabilityConfig.timeSlots && availabilityConfig.timeSlots.length > 5) {
                const timeSlots = JSON.parse(availabilityConfig.timeSlots) as { day: string, active: boolean, slots: { start: string, end: string }[] }[];
                const dayMap: Record<number, string> = { 1: "MON", 2: "TUE", 3: "WED", 4: "THU", 5: "FRI", 6: "SAT", 0: "SUN" };

                daysInInterval.forEach(date => {
                    const dayId = dayMap[date.getDay()];
                    const dayConfig = timeSlots.find(d => d.day === dayId);
                    if (dayConfig && dayConfig.active) {
                        dayConfig.slots.forEach(slot => {
                            const [sH, sM] = slot.start.split(':').map(Number);
                            const [eH, eM] = slot.end.split(':').map(Number);
                            const diff = Math.max(0, (eH * 60 + eM) - (sH * 60 + sM));
                            totalCapacity += diff / 60;
                        });
                    }
                });
            } else {
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
                netBalance: current.netBalance, // THE GREEN CARD metric
                income: current.income,
                expenses: current.expenses,
                forecast,
                defaultTotal,
                period: { start: startCurrent, end: endCurrent },
                delta: {
                    // Logic for delta: if previous was 0, and current is > 0, it's 100% growth (or just infinite)
                    // We stick to safe math
                    income: previous.income > 0 ? ((current.income - previous.income) / previous.income) * 100 : 0,
                    expenses: previous.expenses > 0 ? ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0,
                    netBalance: previous.netBalance > 0 ? ((current.netBalance - previous.netBalance) / previous.netBalance) * 100 : 0
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
        if (filters?.from && filters?.to) {
            where.dueDate = { gte: filters.from, lte: filters.to };
        }

        // 1. Fetch Transactions matches
        const transactions = await db.transaction.findMany({
            where,
            orderBy: { dueDate: 'asc' },
            include: {
                patient: {
                    select: { name: true, id: true }
                } // Ensure we have patient context
            }
        });

        // 2. Efficiently calculate 'Value Per Session'
        // Strategy: Fetch all appointments for these patients in the bounding date range
        // Then group in-memory to avoid N+1 queries.

        if (transactions.length > 0) {
            const patientIds = new Set(transactions.map(t => t.patientId).filter(Boolean) as string[]);

            // Determine range for appointments (cover earliest to latest transaction month)
            const dates = transactions.map(t => t.dueDate);
            const minDate = dates.length ? startOfMonth(new Date(Math.min(...dates.map(d => d.getTime())))) : new Date();
            const maxDate = dates.length ? endOfMonth(new Date(Math.max(...dates.map(d => d.getTime())))) : new Date();

            // Fetch occupied appointments (Realizado, Confirmado, Agendado)
            const appointments = await db.appointment.findMany({
                where: {
                    patientId: { in: Array.from(patientIds) },
                    date: { gte: minDate, lte: maxDate },
                    status: { in: ["Realizado", "Confirmado", "Agendado"] }
                },
                select: {
                    patientId: true,
                    date: true
                }
            });

            // Group by Patient+Month
            // Key: "patientId-Month-Year" -> Count
            const apptMap = new Map<string, number>();

            appointments.forEach(appt => {
                const key = `${appt.patientId}-${appt.date.getMonth()}-${appt.date.getFullYear()}`;
                apptMap.set(key, (apptMap.get(key) || 0) + 1);
            });

            // Map transactions to enrich with session data
            const enrichedTransactions = transactions.map(tx => {
                const patientId = tx.patientId;
                if (!patientId) return { ...tx, sessionCount: 0, sessionValue: 0 };

                // Get count for THIS transaction's month
                const txDate = new Date(tx.dueDate);
                const key = `${patientId}-${txDate.getMonth()}-${txDate.getFullYear()}`;

                const sessionCount = apptMap.get(key) || 0;
                // Avoid division by zero
                const sessionValue = sessionCount > 0 ? (tx.amount / sessionCount) : tx.amount;

                return { ...tx, sessionCount, sessionValue };
            });

            return { success: true, data: enrichedTransactions };
        }

        return { success: true, data: transactions };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { success: false, error: "Failed to fetch transactions" };
    }
}

// --- Mutations with Atomic Integrity ---

async function createGovBrReminder(patientId: string, amount: number, date: Date, txClient?: any) {
    const dbRef = txClient || db;
    try {
        const patient = await dbRef.patient.findUnique({ where: { id: patientId } });
        if (!patient || patient.financialSource !== 'PARTICULAR') return;

        const dueDate = addDays(date, 1);
        await dbRef.reminder.create({
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
        // Note: In an atomic transaction, if this logic throws, the whole transaction fails. 
        // We verify if this is desired. Yes, for integrity, we want 'Perfect History' or 'Nothing'.
        throw e;
    }
}

export async function saveTransaction(data: any) {
    try {
        // Atomic Transaction: Create TX + Optional Reminder
        await db.$transaction(async (tx) => {
            const newTx = await tx.transaction.create({
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
                    patientId: data.patientId
                }
            });

            if ((data.status === "PAID" || data.status === "PAGO" || data.status === "pago") && data.patientId) {
                await createGovBrReminder(data.patientId, data.amount, new Date(), tx);
            }
        });

        revalidatePath("/financeiro");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error creating transaction:", error);
        return { success: false, error: "Failed to create transaction" };
    }
}

export async function settleTransaction(id: string) {
    try {
        const now = new Date();

        // Atomic Settlement
        await db.$transaction(async (tx) => {
            const transaction = await tx.transaction.update({
                where: { id },
                data: {
                    status: "PAID",
                    paymentDate: now
                }
            });

            await tx.paymentHistory.create({
                data: {
                    action: "PAID",
                    amount: transaction.amount,
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                    transactionId: id
                }
            });

            if (transaction.patientId) {
                await createGovBrReminder(transaction.patientId, transaction.amount, now, tx);
            }
        });

        revalidatePath("/financeiro/adimplencia");
        revalidatePath("/financeiro");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error settling transaction:", error);
        return { success: false, error: "Failed to settle transaction" };
    }
}

export async function undoSettlement(id: string) {
    try {
        const now = new Date();

        await db.$transaction(async (tx) => {
            const transaction = await tx.transaction.update({
                where: { id },
                data: {
                    status: "PENDING",
                    paymentDate: null
                }
            });

            await tx.paymentHistory.create({
                data: {
                    action: "REVERTED",
                    amount: transaction.amount,
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                    transactionId: id
                }
            });
        });

        revalidatePath("/financeiro/adimplencia");
        revalidatePath("/financeiro");
        revalidatePath("/dashboard");
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

        const transactions = await db.transaction.findMany({
            where: {
                dueDate: { gte: startOfMonth(startDate), lte: endDate },
                flow: "INCOME"
            },
            include: {
                patient: { select: { name: true, id: true, financialSource: true } }
            },
            orderBy: { dueDate: 'asc' }
        });

        const data = transactions.map((t: any) => {
            let complianceStatus = "WAITING";
            // Check normalized status
            const isPaid = t.status === "PAID" || t.status === "PAGO" || t.status === "pago";
            const isOverdue = !isPaid && new Date(t.dueDate) < startOfDay(today);

            if (isPaid) complianceStatus = "PAID";
            else if (isOverdue) complianceStatus = "OVERDUE";

            return { ...t, complianceStatus };
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
            },
            select: {
                id: true,
                negotiatedValue: true,
                financialSource: true
            }
        });

        let count = 0;
        const dueDate = new Date(year, month, 10);

        // This process iterates, but the mutation per patient is single.
        // We could bubble this up into one giant transaction, but for massive lists it might be too big.
        // Given the scale (~100 patients), let's keep it iterative but fast.
        // Or better: use createMany if possible? Protocol wants individual transactions usually.
        // We'll iterate but keep it clean.

        for (const patient of patients) {
            // Check existence
            const existing = await db.transaction.findFirst({
                where: {
                    patientId: patient.id,
                    dueDate: { gte: startOfMonth(dueDate), lte: endOfMonth(dueDate) },
                    description: { contains: "Mensalidade" }
                },
                select: { id: true }
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

export async function getPaymentHistory(transactionId: string) {
    try {
        const history = await db.paymentHistory.findMany({
            where: { transactionId },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, data: history };
    } catch (error) {
        console.error("Error fetching payment history:", error);
        return { success: false, error: "Failed to fetch payment history" };
    }
}

export async function updateTransactionAmount(id: string, amount: number) {
    try {
        await db.transaction.update({
            where: { id },
            data: { amount }
        });
        revalidatePath("/financeiro");
        revalidatePath("/financeiro/adimplencia");
        return { success: true };
    } catch (error) {
        console.error("Error updating transaction amount:", error);
        return { success: false, error: "Failed to update amount" };
    }
}

export async function getDelinquencyStats() {
    try {
        const today = new Date();
        const overdueResult = await db.transaction.findMany({
            where: {
                flow: "INCOME",
                OR: [
                    { status: "atrasado" },
                    { status: "OVERDUE" },
                    { status: { in: ["pendente", "PENDING"] }, dueDate: { lt: today } }
                ]
            },
            select: {
                amount: true,
                dueDate: true
            }
        });

        const count = overdueResult.length;
        const totalAmount = overdueResult.reduce((acc, t) => acc + t.amount, 0);

        let oldestDays = 0;
        if (count > 0) {
            const oldestDate = overdueResult.reduce((oldest, t) => t.dueDate < oldest ? t.dueDate : oldest, overdueResult[0].dueDate);
            oldestDays = Math.floor((today.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
            success: true,
            data: { count, totalAmount, oldestDays }
        };
    } catch (error) {
        console.error("Error fetching delinquency stats:", error);
        return { success: false, error: "Failed to fetch delinquency stats" };
    }
}
