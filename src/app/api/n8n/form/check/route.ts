import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";

// GET /api/n8n/form/check?phone=5511999999999
// Gabi checks if a mother has already filled the screening form
export async function GET(req: NextRequest) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const phone = req.nextUrl.searchParams.get("phone");

        if (!phone) {
            return NextResponse.json({ error: "phone parameter required" }, { status: 400 });
        }

        const cleanPhone = phone.replace(/\D/g, "");

        const formResponse = await db.formResponse.findFirst({
            where: { phone: { contains: cleanPhone } },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                childName: true,
                responsibleName: true,
                status: true,
                responses: true,
                createdAt: true,
                patientId: true,
            },
        });

        if (formResponse) {
            return NextResponse.json({
                respondido: true,
                dataResposta: formResponse.createdAt.toISOString().split("T")[0],
                crianca: formResponse.childName,
                responsavel: formResponse.responsibleName,
                status: formResponse.status,
                formResponseId: formResponse.id,
                respostas: formResponse.responses,
            });
        }

        return NextResponse.json({
            respondido: false,
            dataResposta: null,
            crianca: null,
            responsavel: null,
        });
    } catch (error) {
        console.error("Form Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
