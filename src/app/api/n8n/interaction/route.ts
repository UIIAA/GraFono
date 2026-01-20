import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";

export async function POST(req: NextRequest) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const body = await req.json();
        const { patientId, content, type } = body;

        if (!patientId || !content) {
            return NextResponse.json({ error: "Patient ID and Content are required" }, { status: 400 });
        }

        await db.patientHistory.create({
            data: {
                patientId,
                content,
                type: type || "WHATSAPP_LOG",
                date: new Date()
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("N8N Interaction Log Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
