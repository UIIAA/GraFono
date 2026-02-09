import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";

const ALLOWED_STATUSES = [
    "Novo Lead",
    "Contato Inicial",
    "Lead",
    "Avaliação",
    "Em Terapia",
    "Em Espera",
    "Alta",
    "Arquivado"
];

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const { id } = await params;

        const patient = await db.patient.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                gender: true,
                dateOfBirth: true,
                observations: true,
                negotiatedValue: true,
                financialSource: true,
                category: true,
                paymentMethod: true,
                reevaluationInterval: true,
                nextReevaluation: true,
                motherName: true,
                createdAt: true,
            }
        });

        if (!patient) {
            return NextResponse.json(
                { error: "Patient not found" },
                { status: 404 }
            );
        }

        // Fetch next upcoming appointment
        const nextAppointment = await db.appointment.findFirst({
            where: {
                patientId: id,
                status: "Agendado",
                date: {
                    gte: new Date()
                }
            },
            orderBy: {
                date: "asc"
            },
            select: {
                id: true,
                date: true,
                time: true,
                status: true,
                type: true,
                location: true,
                notes: true,
            }
        });

        return NextResponse.json({
            patient: {
                ...patient,
                nextAppointment: nextAppointment || null
            }
        });

    } catch (error) {
        console.error("N8N Get Patient Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
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
        const { status, observations, phone, name } = body;

        // Validate status if provided
        if (status && !ALLOWED_STATUSES.includes(status)) {
            return NextResponse.json(
                {
                    error: "Invalid status",
                    allowedStatuses: ALLOWED_STATUSES
                },
                { status: 400 }
            );
        }

        // Check if patient exists
        const existingPatient = await db.patient.findUnique({
            where: { id },
            select: { id: true, status: true }
        });

        if (!existingPatient) {
            return NextResponse.json(
                { error: "Patient not found" },
                { status: 404 }
            );
        }

        // If status is being changed, create history entry
        if (status && status !== existingPatient.status) {
            await db.patientHistory.create({
                data: {
                    patientId: id,
                    content: `Status alterado de "${existingPatient.status}" para "${status}" via N8N`,
                    date: new Date(),
                }
            });
        }

        // Build update data object
        const updateData: Record<string, string> = {};
        if (status) updateData.status = status;
        if (observations !== undefined) updateData.observations = observations;
        if (phone) updateData.phone = phone;
        if (name) updateData.name = name;

        // Update patient
        const updatedPatient = await db.patient.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                observations: true,
                updatedAt: true,
            }
        });

        return NextResponse.json({
            success: true,
            patient: updatedPatient
        });

    } catch (error) {
        console.error("N8N Update Patient Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
