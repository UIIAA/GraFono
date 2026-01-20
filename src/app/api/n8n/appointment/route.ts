import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";
import { format } from "date-fns";

export async function POST(req: NextRequest) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const body = await req.json();
        const { patientId, date, type } = body;

        if (!patientId || !date) {
            return NextResponse.json({ error: "Patient ID and Date are required" }, { status: 400 });
        }

        const appointmentDate = new Date(date);
        const timeStr = format(appointmentDate, "HH:mm");

        const appointment = await db.appointment.create({
            data: {
                patientId,
                date: appointmentDate,
                time: timeStr,
                type: type || "Avaliação Inicial",
                status: "Agendado",
                location: "Presencial" // Default
            }
        });

        return NextResponse.json({
            success: true,
            appointment: {
                id: appointment.id,
                date: appointment.date,
                status: appointment.status
            }
        });

    } catch (error) {
        console.error("N8N Appointment Creation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
