import { NextRequest, NextResponse } from "next/server";
import { getAvailabilityConfig, AvailabilityData } from "@/app/actions/settings";
import { getAppointments } from "@/app/actions/appointment";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";
import { format, getDay, parse, addMinutes, isBefore, isAfter, isEqual, startOfDay, endOfDay, addDays } from "date-fns";

// Map Portuguese day names to JS weekday numbers (0=Sun, 1=Mon, ..., 6=Sat)
const DAY_NAME_MAP: Record<string, number> = {
    "segunda": 1, "segunda-feira": 1, "seg": 1,
    "terca": 2, "terça": 2, "terca-feira": 2, "terça-feira": 2, "ter": 2,
    "quarta": 3, "quarta-feira": 3, "qua": 3,
    "quinta": 4, "quinta-feira": 4, "qui": 4,
    "sexta": 5, "sexta-feira": 5, "sex": 5,
    "sabado": 6, "sábado": 6, "sab": 6,
    "domingo": 0, "dom": 0,
    "hoje": -1, "today": -1,
    "amanha": -2, "amanhã": -2, "tomorrow": -2,
};

function resolveDateStr(input: string): Date | null {
    const normalized = input.trim().toLowerCase();

    // Check if it's a day name
    const dayNum = DAY_NAME_MAP[normalized];
    if (dayNum !== undefined) {
        const today = new Date();
        if (dayNum === -1) return today; // hoje
        if (dayNum === -2) return addDays(today, 1); // amanha

        // Find next occurrence of this weekday
        const currentDay = today.getDay(); // 0=Sun
        let daysAhead = dayNum - currentDay;
        if (daysAhead <= 0) daysAhead += 7; // next week if today or past
        return addDays(today, daysAhead);
    }

    // Try as YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
        return new Date(normalized + "T00:00:00");
    }

    return null;
}

export async function GET(req: NextRequest) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get("date");

        if (!dateStr) {
            return NextResponse.json({ error: "Date parameter required. Use YYYY-MM-DD or day name (segunda, terca, quarta, quinta, sexta, sabado)" }, { status: 400 });
        }

        const date = resolveDateStr(dateStr);
        if (!date || isNaN(date.getTime())) {
            return NextResponse.json({ error: `Could not parse date: "${dateStr}". Use YYYY-MM-DD or day name (quarta, sexta, etc.)` }, { status: 400 });
        }
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
            const resolvedDate = format(date, "yyyy-MM-dd");
            return NextResponse.json({ date: resolvedDate, day: dayId, availableSlots: [], message: "Sem horarios disponiveis neste dia" });
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

        const resolvedDate = format(date, "yyyy-MM-dd");
        return NextResponse.json({
            date: resolvedDate,
            day: dayId,
            availableSlots
        });

    } catch (error) {
        console.error("N8N Calendar Slots Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
