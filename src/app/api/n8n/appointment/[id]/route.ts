import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const { id } = await params;

        const appointment = await db.appointment.findUnique({
            where: { id },
            include: {
                patient: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            appointment: {
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                status: appointment.status,
                type: appointment.type,
                location: appointment.location,
                notes: appointment.notes,
                patientId: appointment.patientId,
                patientName: appointment.patient.name,
                createdAt: appointment.createdAt,
                updatedAt: appointment.updatedAt
            }
        });

    } catch (error) {
        console.error("N8N Get Appointment Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { status, date, time, notes } = body;

        // Validate that at least one field is provided
        if (!status && !date && !time && notes === undefined) {
            return NextResponse.json(
                { error: "At least one field (status, date, time, notes) must be provided" },
                { status: 400 }
            );
        }

        // Check if appointment exists
        const existingAppointment = await db.appointment.findUnique({
            where: { id },
            include: {
                patient: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!existingAppointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        // Build update data
        const updateData: {
            status?: string;
            date?: Date;
            time?: string;
            notes?: string;
        } = {};

        if (status) updateData.status = status;
        if (date) updateData.date = new Date(date);
        if (time) updateData.time = time;
        if (notes !== undefined) updateData.notes = notes;

        // If status is being changed to "Cancelado", create a PatientHistory entry
        if (status === "Cancelado") {
            await db.patientHistory.create({
                data: {
                    patientId: existingAppointment.patientId,
                    content: `Consulta cancelada: ${existingAppointment.type} agendada para ${existingAppointment.date.toLocaleDateString("pt-BR")}${existingAppointment.time ? ` às ${existingAppointment.time}` : ""}`
                }
            });
        }

        // Update the appointment
        const updatedAppointment = await db.appointment.update({
            where: { id },
            data: updateData,
            include: {
                patient: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            appointment: {
                id: updatedAppointment.id,
                date: updatedAppointment.date,
                time: updatedAppointment.time,
                status: updatedAppointment.status,
                type: updatedAppointment.type,
                location: updatedAppointment.location,
                notes: updatedAppointment.notes,
                patientId: updatedAppointment.patientId,
                patientName: updatedAppointment.patient.name,
                createdAt: updatedAppointment.createdAt,
                updatedAt: updatedAppointment.updatedAt
            }
        });

    } catch (error) {
        console.error("N8N Update Appointment Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
