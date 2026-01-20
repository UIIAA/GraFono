import { NextRequest, NextResponse } from "next/server";
import { getAvailabilityConfig, AvailabilityData } from "@/app/actions/settings";
import { getAppointments } from "@/app/actions/appointment";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";
import { format, getDay, parse, addMinutes, isBefore, isAfter, isEqual, startOfDay, endOfDay } from "date-fns";

export async function GET(req: NextRequest) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get("date");

        if (!dateStr) {
            return NextResponse.json({ error: "Date parameter required (YYYY-MM-DD)" }, { status: 400 });
        }

        const date = new Date(dateStr + "T00:00:00"); // Force local/UTC consistency or handle timezone carefully
        // Ideally we should use ISO strings with timezone, but simple YYYY-MM-DD is common for easy integrations.
        // Assuming server and clinic are in same timezone or handled via Date object.

        // 1. Fetch Config and Appointments
        const [configRes, appointmentsRes] = await Promise.all([
            getAvailabilityConfig(),
            getAppointments(startOfDay(date), endOfDay(date))
        ]);

        if (!configRes) {
            return NextResponse.json({ error: "Availability not configured" }, { status: 500 });
        }

        const availability = configRes as AvailabilityData;
        const appointments = appointmentsRes.success ? appointmentsRes.data || [] : [];

        // 2. Generate All Potential Slots for the Day
        const slots: string[] = [];
        const sessionDuration = availability.sessionDuration || 30;

        // Check legacy logic first for range
        // Or if granular is available, check day specific
        const dayId = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][getDay(date)];

        let validSlots: { start: string, end: string }[] = [];

        // Granular Logic
        const dayConfig = availability.timeSlots?.find(d => d.day === dayId);
        if (dayConfig && dayConfig.active) {
            dayConfig.slots.forEach(slot => {
                validSlots.push({ start: slot.start, end: slot.end });
            });
        }
        // Fallback/Legacy Logic if no granular or not active?
        // Actually, if timeSlots is populated (new system), usage varies.
        // The page logic prioritizes timeSlots if present.

        if (!validSlots.length && availability.workingDays.includes(dayId)) {
            // Fallback to legacy start/end
            validSlots.push({ start: availability.startHour, end: availability.endHour });
        }

        if (validSlots.length === 0) {
            return NextResponse.json({ date: dateStr, availableSlots: [] });
        }

        // Generate discrete slots
        validSlots.forEach(range => {
            let current = parse(range.start, "HH:mm", date);
            const end = parse(range.end, "HH:mm", date);

            // Exclude Lunch if legacy
            const lunchStart = availability.lunchStart ? parse(availability.lunchStart, "HH:mm", date) : null;
            const lunchEnd = availability.lunchEnd ? parse(availability.lunchEnd, "HH:mm", date) : null;

            while (isBefore(current, end)) {
                const nextSlot = addMinutes(current, sessionDuration);

                // If the session goes beyond the range end, break
                if (isAfter(nextSlot, end)) break;

                // Check Lunch (Legacy only usually, unless we bake it into granular slots)
                let isLunch = false;
                if (lunchStart && lunchEnd) {
                    // Overlap check
                    if ((isAfter(current, lunchStart) || isEqual(current, lunchStart)) && isBefore(current, lunchEnd)) {
                        isLunch = true;
                    }
                }

                if (!isLunch) {
                    const timeStr = format(current, "HH:mm");
                    slots.push(timeStr);
                }

                current = nextSlot;
            }
        });

        // 3. Filter Occupied Slots
        const availableSlots = slots.filter(time => {
            // Simple check: is there an appointment at this time?
            // Existing appointments have apt.date (DateTime) and apt.time (String "HH:mm") sometimes redundancy.
            // apt.date is typically the start time.
            return !appointments.some(apt => {
                // Format apt date to HH:mm
                const aptTime = format(new Date(apt.date), "HH:mm");
                // Or use apt.time if reliable. 
                // Let's use format on apt.date as source of truth usually in Prisma.
                // Actually previous code used `apt.time` string. Let's check schema/types.
                // Appointment model has `time String` field?
                // Let's look at schema viewed previously.
                // Model Appointment { id, date DateTime, time String ... }
                // Yes, relying on `apt.time` is safer if the Logic stores it there.
                return apt.time === time;
            });
        });

        return NextResponse.json({
            date: dateStr,
            day: dayId,
            availableSlots
        });

    } catch (error) {
        console.error("N8N Calendar Slots Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
