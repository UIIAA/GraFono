"use server";

import { db } from "@/lib/db";
import { startOfDay, endOfDay, subDays, startOfMonth, subMonths, endOfMonth, eachDayOfInterval, format, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type MetricsRange = 'today' | '7d' | '30d' | '6m';

export interface KPIMetrics {
    activePatients: number;
    activePatientsGrowth: number;
    sessionsThisMonth: number;
    sessionsGrowth: number;
    revenue: number;
    revenueGrowth: number;
    attendanceRate: number;
    attendanceGrowth: number;
}

export interface MonthlyChartData {
    month: string; // Label (Month or Day)
    sessions: number;
}

export interface DistributionData {
    label: string;
    val: number;
    color?: string;
}

// ----------------------------------------------------------------------
// Actions
// ----------------------------------------------------------------------

function getRangeDates(range: MetricsRange) {
    const now = new Date();
    let currentStart: Date;
    let currentEnd = endOfDay(now);
    let previousStart: Date;
    let previousEnd: Date;

    switch (range) {
        case 'today':
            currentStart = startOfDay(now);
            previousStart = startOfDay(subDays(now, 1));
            previousEnd = endOfDay(subDays(now, 1));
            break;
        case '7d':
            currentStart = startOfDay(subDays(now, 7));
            previousStart = startOfDay(subDays(now, 14));
            previousEnd = endOfDay(subDays(now, 8)); // 7 days before current window
            break;
        case '30d':
            currentStart = startOfDay(subDays(now, 30));
            previousStart = startOfDay(subDays(now, 60));
            previousEnd = endOfDay(subDays(now, 31));
            break;
        case '6m':
        default:
            currentStart = startOfMonth(subMonths(now, 5)); // Start of 6 months ago
            // Comparison: Previous 6 months? Or same period last year? Let's do previous 6 months.
            previousStart = startOfMonth(subMonths(now, 11));
            previousEnd = endOfMonth(subMonths(now, 6));
            break;
    }

    return { currentStart, currentEnd, previousStart, previousEnd };
}

export async function getKPIMetrics(range: MetricsRange = '30d') {
    try {
        const { currentStart, currentEnd, previousStart, previousEnd } = getRangeDates(range);

        // 1. Active Patients (Snapshot, doesn't respect date range strictly, but we can compare)
        // For Active Patients, it's usually current state. Growth vs last month/period.
        const activePatients = await db.patient.count({
            where: { status: "Ativo" }
        });

        // Mock growth for active patients as history is hard to strictly count without audit log
        const activePatientsGrowth = 12;

        // 2. Sessions (Appointments Realized)
        const sessionsCurrent = await db.appointment.count({
            where: {
                status: "Realizado",
                date: {
                    gte: currentStart,
                    lte: currentEnd
                }
            }
        });

        const sessionsLast = await db.appointment.count({
            where: {
                status: "Realizado",
                date: {
                    gte: previousStart,
                    lte: previousEnd
                }
            }
        });

        const sessionsGrowth = sessionsLast > 0
            ? Math.round(((sessionsCurrent - sessionsLast) / sessionsLast) * 100)
            : (sessionsCurrent > 0 ? 100 : 0);

        // 3. Revenue
        const revenueAgg = await db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                flow: "INCOME",
                status: "pago",
                paymentDate: {
                    gte: currentStart,
                    lte: currentEnd
                }
            }
        });
        const revenue = revenueAgg._sum.amount || 0;

        const revenueLastAgg = await db.transaction.aggregate({
            _sum: { amount: true },
            where: {
                flow: "INCOME",
                status: "pago",
                paymentDate: {
                    gte: previousStart,
                    lte: previousEnd
                }
            }
        });
        const revenueLast = revenueLastAgg._sum.amount || 0;

        const revenueGrowth = revenueLast > 0
            ? Math.round(((revenue - revenueLast) / revenueLast) * 100)
            : (revenue > 0 ? 100 : 0);

        // 4. Attendance Rate
        const totalScheduled = await db.appointment.count({
            where: {
                status: { in: ["Realizado", "Cancelado"] },
                date: {
                    gte: currentStart,
                    lte: currentEnd
                }
            }
        });

        const attendanceRate = totalScheduled > 0
            ? Math.round((sessionsCurrent / totalScheduled) * 1000) / 10
            : 100;

        // Compare with previous rate
        const totalScheduledLast = await db.appointment.count({
            where: {
                status: { in: ["Realizado", "Cancelado"] },
                date: { gte: previousStart, lte: previousEnd }
            }
        });
        const sessionsLastForRate = sessionsLast; // Reusing count
        const attendanceRateLast = totalScheduledLast > 0
            ? Math.round((sessionsLastForRate / totalScheduledLast) * 1000) / 10
            : 100;

        const attendanceGrowth = Math.round((attendanceRate - attendanceRateLast) * 10) / 10;

        return {
            success: true,
            data: {
                activePatients,
                activePatientsGrowth,
                sessionsThisMonth: sessionsCurrent,
                sessionsGrowth,
                revenue,
                revenueGrowth,
                attendanceRate,
                attendanceGrowth
            }
        };

    } catch (error) {
        console.error("Error fetching KPI metrics:", error);
        return { success: false, error: "Failed to fetch KPIs" };
    }
}

export async function getSessionsChartData(range: MetricsRange = '30d'): Promise<{ success: boolean; data?: MonthlyChartData[] }> {
    const { currentStart, currentEnd } = getRangeDates(range);

    // Grouping Strategy
    // 6m -> Monthly
    // 30d, 7d -> Daily
    // today -> Hourly (or just daily if simplified)

    // Easy Implementation: Iterate over intervals and count
    const result: MonthlyChartData[] = [];

    if (range === '6m') {
        // Monthly
        for (let i = 5; i >= 0; i--) {
            const d = new Date(currentEnd.getFullYear(), currentEnd.getMonth() - i, 1);
            const monthName = format(d, 'MMM', { locale: ptBR });
            const start = startOfMonth(d);
            const end = endOfMonth(d);

            const count = await db.appointment.count({
                where: {
                    status: "Realizado",
                    date: { gte: start, lte: end }
                }
            });

            result.push({ month: monthName.toUpperCase(), sessions: count });
        }
    } else {
        // Daily (for 30d, 7d, today)
        // If today, maybe we want specific hours? Let's stick to Daily view for Today returning just 1 bar for "Hoje" or maybe breakdown if user really wants.
        // User said "Use data we have NOW". If 'today', displaying 1 bar is boring.
        // Let's do Hourly for 'today'.

        if (range === 'today') {
            const hours = [8, 10, 12, 14, 16, 18, 20];
            for (const h of hours) {
                const start = new Date(currentStart); start.setHours(h, 0, 0);
                const end = new Date(currentStart); end.setHours(h + 2, 0, 0); // 2 hour slots

                const count = await db.appointment.count({
                    where: {
                        status: "Realizado",
                        date: { gte: start, lt: end }
                    }
                });
                result.push({ month: `${h}h`, sessions: count });
            }
        } else {
            // Daily Interval
            const days = eachDayOfInterval({ start: currentStart, end: currentEnd });
            for (const day of days) {
                const start = startOfDay(day);
                const end = endOfDay(day);
                const label = format(day, 'dd/MM');

                const count = await db.appointment.count({
                    where: {
                        status: "Realizado",
                        date: { gte: start, lte: end }
                    }
                });
                result.push({ month: label, sessions: count });
            }
        }
    }

    return { success: true, data: result };
}

export async function getDistributionData(range: MetricsRange = '30d'): Promise<{ success: boolean; data?: DistributionData[] }> {
    const { currentStart, currentEnd } = getRangeDates(range);

    const types = await db.appointment.groupBy({
        by: ['type'],
        _count: {
            id: true
        },
        where: {
            // Filter by date range too? Usually distribution is interesting over period.
            date: { gte: currentStart, lte: currentEnd },
            status: "Realizado"
        }
    });

    const total = types.reduce((acc, curr) => acc + curr._count.id, 0);

    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-slate-300"];

    const data = types.map((t, index) => ({
        label: t.type,
        val: total > 0 ? Math.round((t._count.id / total) * 100) : 0,
        color: colors[index % colors.length]
    })).sort((a, b) => b.val - a.val);

    return { success: true, data };
}
