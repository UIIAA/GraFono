"use server";

import { db } from "@/lib/db";

export async function getDashboardMetrics() {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);
        endOfWeek.setHours(23, 59, 59, 999);

        // Get appointments for the next 7 days
        const weekAppointments = await db.appointment.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfWeek
                }
            },
            include: {
                patient: true
            },
            orderBy: [
                { date: 'asc' },
                { time: 'asc' }
            ]
        });

        // Current 'appointmentsToday' will now be filtered from 'weekAppointments' on the client or we can just extract it here for convenience if needed, 
        // but let's rename the return field to be more generic or just return weekAppointments


        // Get next appointment (first one after now)
        // Note: 'time' stores string "HH:mm", date stores Date object (usually set to mid-day or 00:00 depending on how created)
        // We need to be careful with comparison if date includes time or is just date.
        // Assuming date is stored as DateTime.

        const now = new Date();
        const nextAppointment = await db.appointment.findFirst({
            where: {
                date: {
                    gte: startOfDay // Look for anything from today onwards
                },
                // In a real app we'd filter by time if date is today, but for MVP:
            },
            include: {
                patient: true
            },
            orderBy: [
                { date: 'asc' },
                { time: 'asc' }
            ]
        });

        // Fetch Reevaluation Alerts (Due within 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const reevaluationAlerts = await db.patient.findMany({
            where: {
                nextReevaluation: {
                    lte: thirtyDaysFromNow
                },
                status: {
                    in: ["Ativo", "Em Terapia", "Em Tratamento", "Em avaliação"] // Active patients only
                }
            },
            take: 5,
            orderBy: {
                nextReevaluation: 'asc'
            }
        });

        return {
            success: true,
            data: {
                weekAppointments,
                nextAppointment,
                counts: {
                    today: weekAppointments.filter(a => {
                        const appDate = new Date(a.date);
                        return appDate.getDate() === today.getDate() &&
                            appDate.getMonth() === today.getMonth() &&
                            appDate.getFullYear() === today.getFullYear();
                    }).length
                },
                reevaluationAlerts: reevaluationAlerts || [] // Add to response
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        return { success: false, error: "Failed to fetch metrics" };
    }
}
