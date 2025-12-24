"use server";

import { db } from "@/lib/db";

export async function getDashboardMetrics() {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Get today's appointments
        const appointmentsToday = await db.appointment.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                patient: true
            },
            orderBy: {
                time: 'asc'
            }
        });

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

        return {
            success: true,
            data: {
                appointmentsToday,
                nextAppointment,
                counts: {
                    today: appointmentsToday.length
                }
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        return { success: false, error: "Failed to fetch metrics" };
    }
}
