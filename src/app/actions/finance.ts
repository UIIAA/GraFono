"use server";

import { db } from "@/lib/db";
import { startOfMonth, endOfMonth, addDays, startOfDay, endOfDay, isWeekend, eachDayOfInterval } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getFinancialMetrics() {
    try {
        const today = new Date();
        const startCurrentMonth = startOfMonth(today);
        const endCurrentMonth = endOfMonth(today);
        const next30Days = addDays(today, 30);

        // 1. Net Balance (Lucro Real)
        const transactionsThisMonth = await (db as any).transaction.findMany({
            where: {
                paymentDate: {
                    gte: startCurrentMonth,
                    lte: endCurrentMonth
                },
                OR: [
                    { status: "PAID" },
                    { status: "PAGO" },
                    { status: "pago" }
                ]
            }
        });

        const income = transactionsThisMonth
            .filter((t: any) => t.flow === "INCOME" || (!t.flow && t.amount > 0))
            .reduce((acc: number, t: any) => acc + t.amount, 0);

        const expenses = transactionsThisMonth
            .filter((t: any) => t.flow === "EXPENSE")
            .reduce((acc: number, t: any) => acc + t.amount, 0);

        const netBalance = income - expenses;


        // 2. Receivables Forecast (Previsão 30 dias)
        const pendingTransactions = await (db as any).transaction.findMany({
            where: {
                status: { in: ["pendente", "PENDING", "AGENDADO"] },
                dueDate: {
                    gte: today,
                    lte: next30Days
                },
                flow: "INCOME"
            }
        });
        const receivablesTransactions = pendingTransactions.reduce((acc: number, t: any) => acc + t.amount, 0);

        const futureAppointments = await db.appointment.findMany({
            where: {
                date: {
                    gte: today,
                    lte: next30Days
                },
                status: "Agendado"
            },
            include: {
                patient: true
            }
        });

        let receivablesAppointments = 0;
        futureAppointments.forEach(apt => {
            const val = (apt.patient as any)?.negotiatedValue || 150;
            receivablesAppointments += val;
        });

        const forecast = receivablesTransactions + receivablesAppointments;


        // 3. Default Index (Inadimplência)
        const overdueTransactions = await (db as any).transaction.findMany({
            where: {
                OR: [
                    { status: "atrasado" },
                    { status: "OVERDUE" },
                    {
                        status: { in: ["pendente", "PENDING"] },
                        dueDate: { lt: today }
                    }
                ],
                flow: "INCOME"
            }
        });
        const defaultTotal = overdueTransactions.reduce((acc: number, t: any) => acc + t.amount, 0);


        // 4. Strategic Metrics: Occupancy & Ticket
        const realizedAppointments = await db.appointment.count({
            where: {
                date: {
                    gte: startCurrentMonth,
                    lte: endCurrentMonth
                },
                status: "Realizado"
            }
        });

        // Avg Ticket: Revenue / Realized Sessions
        // (Uses Income from Transactions, assuming they correspond to the realized sessions roughly)
        // A more precise way would be to sum the value of realized sessions, but for Cash Flow view, this is good.
        const avgTicket = realizedAppointments > 0 ? (income / realizedAppointments) : 0;

        // Occupancy Calculation
        // Fetch Config
        const availabilityConfig = await (db as any).availabilityConfig.findFirst();

        let totalCapacity = 0;
        if (availabilityConfig) {
            const daysInMonth = eachDayOfInterval({ start: startCurrentMonth, end: endCurrentMonth });
            const workingDaysList = JSON.parse(availabilityConfig.workingDays); // ["MON", "TUE" ...]

            const dayMap: Record<number, string> = { 1: "MON", 2: "TUE", 3: "WED", 4: "THU", 5: "FRI", 6: "SAT", 0: "SUN" };

            // Count valid working days in this month
            const validDays = daysInMonth.filter(d => workingDaysList.includes(dayMap[d.getDay()]));

            // Calculate daily hours
            const startH = parseInt(availabilityConfig.startHour.split(":")[0]);
            const endH = parseInt(availabilityConfig.endHour.split(":")[0]);
            let dailyHours = endH - startH;

            // Subtract lunch if exists
            if (availabilityConfig.lunchStart && availabilityConfig.lunchEnd) {
                const lStart = parseInt(availabilityConfig.lunchStart.split(":")[0]);
                const lEnd = parseInt(availabilityConfig.lunchEnd.split(":")[0]);
                dailyHours -= (lEnd - lStart);
            }

            totalCapacity = validDays.length * dailyHours;
        } else {
            // Fallback default calculation (Mon-Fri, 8h/day)
            const daysInMonth = eachDayOfInterval({ start: startCurrentMonth, end: endCurrentMonth });
            const workingDays = daysInMonth.filter(day => !isWeekend(day)).length;
            totalCapacity = workingDays * 8;
        }

        // Count Confirmed/Realized appointments duration (assuming 1h for simplicity or config)
        // Ideally we sum duration. For now, count * 1 hour (or fractional if we knew duration)
        const occupiedCount = await db.appointment.count({
            where: {
                date: {
                    gte: startCurrentMonth,
                    lte: endCurrentMonth
                },
                status: {
                    in: ["Agendado", "Confirmado", "Realizado"]
                }
            }
        });

        // If we have sessionDuration in config, use it. Else 1h.
        const durationHours = availabilityConfig?.sessionDuration ? (availabilityConfig.sessionDuration / 60) : 1;
        const occupiedHours = occupiedCount * durationHours;

        const occupancyRate = totalCapacity > 0 ? (occupiedHours / totalCapacity) * 100 : 0;

        return {
            success: true,
            data: {
                netBalance,
                income,
                expenses,
                forecast,
                defaultTotal,
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

        const transactions = await (db as any).transaction.findMany({
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

export async function saveTransaction(data: any) {
    try {
        await (db as any).transaction.create({
            data: {
                description: data.description,
                amount: data.amount,
                type: data.type,
                flow: data.flow || "INCOME",
                category: data.category,
                source: data.source,
                status: data.status,
                dueDate: data.dueDate,
                patientId: data.patientId // Optional now
            }
        });
        revalidatePath("/financeiro");
        return { success: true };
    } catch (error) {
        console.error("Error creating transaction:", error);
        return { success: false, error: "Failed to create transaction" };
    }
}

// --- Compliance List Actions ---

export async function getComplianceList(month: number, year: number) {
    try {
        const startDate = startOfMonth(new Date(year, month));
        const endDate = endOfMonth(new Date(year, month));

        const transactions = await (db as any).transaction.findMany({
            where: {
                OR: [
                    {
                        // Match by Due Date (Standard)
                        dueDate: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    {
                        // OR Match by Payment Date (if paid in this month but due elsewhere? 
                        // Actually, for compliance list, we usually care about the competence (Due Date).
                        // But if we want to show everything "happening" this month:
                        paymentDate: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                ],
                flow: "INCOME" // Only Receivables
            },
            include: {
                patient: true
            },
            orderBy: {
                dueDate: 'asc'
            }
        });

        // Post-process to add "Compliance Status" logic
        // WAITING: Before Due Date (or 1st-5th for Monthly)
        // OVERDUE: After Due Date without payment
        // PAID: status == "PAID"
        const processed = transactions.map((t: any) => {
            let complianceStatus = "WAITING";
            const isPaid = ["PAID", "PAGO", "pago"].includes(t.status);

            if (isPaid) {
                complianceStatus = "PAID";
            } else {
                const today = startOfDay(new Date());
                const due = startOfDay(new Date(t.dueDate));

                if (today > due) {
                    complianceStatus = "OVERDUE";
                }
            }

            return {
                ...t,
                complianceStatus
            };
        });

        return { success: true, data: processed };

    } catch (error) {
        console.error("Error fetching compliance list:", error);
        return { success: false, error: "Failed to fetch compliance list" };
    }
}

export async function generateMonthlyCharges(month: number, year: number) {
    try {
        const startDate = startOfMonth(new Date(year, month));
        const endDate = endOfMonth(new Date(year, month));
        const referenceSuffix = `_${month}_${year}`; // e.g. _0_2025 for Jan 2025

        // 1. Get Active Patients for Monthly Fees
        // Assuming "Em tratamento" or "Em Terapia" or similar.
        // We broadly check for patients that have a negotiatedValue > 0 or financialSource == "PARTICULAR"
        // Adjust status filter as needed.
        const activePatients = await (db as any).patient.findMany({
            where: {
                status: {
                    in: ["Em Terapia", "Em Andamento", "Ativo"]
                },
                financialSource: "PARTICULAR" // Only charge private patients automatically?
            }
        });

        let generatedCount = 0;

        for (const p of activePatients) {
            const refId = `MONTHLY${referenceSuffix}_${p.id}`;

            const existing = await (db as any).transaction.findFirst({
                where: { referenceId: refId }
            });

            if (!existing) {
                // Due Date: 5th of the month
                const dueDate = new Date(year, month, 5);
                const amount = (p as any).negotiatedValue || 0; // Default to 0 if not set? Or skip?

                if (amount > 0) {
                    await (db as any).transaction.create({
                        data: {
                            description: "Mensalidade Terapia",
                            amount: amount,
                            type: "Mensalidade",
                            flow: "INCOME",
                            category: "Receita Fixa",
                            source: "PARTICULAR",
                            status: "PENDING",
                            dueDate: dueDate,
                            patientId: p.id,
                            referenceId: refId,
                            isMonthly: true
                        }
                    });
                    generatedCount++;
                }
            }
        }

        // 2. Scan Assessments (Avaliações) in this month
        const assessments = await db.appointment.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                },
                type: { contains: "Avaliação" } // Simplistic check
            },
            include: { patient: true }
        });

        for (const apt of assessments) {
            const refId = `APT_${apt.id}`;
            const existing = await (db as any).transaction.findFirst({
                where: { referenceId: refId }
            });

            if (!existing) {
                // Determine value? 
                const amount = (apt.patient as any)?.negotiatedValue || 150; // Default assessment price?

                await (db as any).transaction.create({
                    data: {
                        description: `Avaliação - ${apt.patient.name}`,
                        amount: amount,
                        type: "Avaliação Avulsa",
                        flow: "INCOME",
                        category: "Receita Variável",
                        source: (apt.patient as any).financialSource || "PARTICULAR",
                        status: "PENDING",
                        dueDate: apt.date, // Due on Appointment Date
                        patientId: apt.patientId,
                        referenceId: refId,
                        isMonthly: false
                    }
                });
                generatedCount++;
            }
        }

        revalidatePath("/financeiro/adimplencia");
        return { success: true, count: generatedCount };

    } catch (error) {
        console.error("Error generating charges:", error);
        return { success: false, error: "Failed to generate charges" };
    }
}

export async function settleTransaction(id: string) {
    try {
        await (db as any).transaction.update({
            where: { id },
            data: {
                status: "PAID",
                paymentDate: new Date()
            }
        });
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
        await (db as any).transaction.update({
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
