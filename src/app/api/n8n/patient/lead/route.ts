import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";

export async function POST(req: NextRequest) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const body = await req.json();
        const { name, phone, demand, origin } = body;

        if (!name || !phone) {
            return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
        }

        // Check availability if needed, but for now just create.
        // We use "Contato Inicial" status for leads.
        const newExams = demand ? `Demanda: ${demand}` : "";

        const patient = await db.patient.create({
            data: {
                name: body.name,
                phone: body.phone,
                gender: body.gender || "Indefinido",
                dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : new Date(),
                status: body.status || "Novo Lead",


                observations: body.observations || newExams, // Use newExams if body.observations is not provided
                // Add origin to history or generic field if available,
                // but schema doesn't have 'origin' field on Patient.
                // We'll log it in history right after creation if strictly needed,
                // but the prompt implies simple creation.
            }
        });

        // Optional: Add initial history log
        await db.patientHistory.create({
            data: {
                patientId: patient.id,
                content: `Lead criado via WhatsApp/N8N. ${demand ? `Demanda: ${demand}` : ""}`,
                date: new Date(),
            }
        });

        return NextResponse.json({
            success: true,
            patient: {
                id: patient.id,
                name: patient.name,
                status: patient.status
            }
        });

    } catch (error) {
        console.error("N8N Lead Creation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
