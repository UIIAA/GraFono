import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/n8n/form/response
// Receives Google Forms submission via Apps Script webhook
// Auth: uses a separate form secret (not x-api-key) since Apps Script is external
export async function POST(req: NextRequest) {
    try {
        const secret = req.headers.get("x-form-secret");
        const validSecret = process.env.FORM_WEBHOOK_SECRET;

        if (!validSecret || secret !== validSecret) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { phone, email, childName, childBirthDate, responsibleName, responses } = body;

        if (!phone || !childName || !responsibleName) {
            return NextResponse.json(
                { error: "phone, childName and responsibleName are required" },
                { status: 400 }
            );
        }

        // Clean phone: keep only digits
        const cleanPhone = phone.replace(/\D/g, "");

        // Check if patient already exists by phone
        const existingPatient = await db.patient.findFirst({
            where: { phone: { contains: cleanPhone } },
            select: { id: true },
        });

        // Save form response
        const formResponse = await db.formResponse.create({
            data: {
                phone: cleanPhone,
                email: email || null,
                childName,
                childBirthDate: childBirthDate || null,
                responsibleName,
                responses: responses || {},
                patientId: existingPatient?.id || null,
            },
        });

        return NextResponse.json({
            success: true,
            formResponseId: formResponse.id,
            linkedToPatient: !!existingPatient,
        });
    } catch (error) {
        console.error("Form Response Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
