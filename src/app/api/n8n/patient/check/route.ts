import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";

export async function POST(req: NextRequest) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const body = await req.json();
        const { phone } = body;

        if (!phone) {
            return NextResponse.json({ error: "Phone number required" }, { status: 400 });
        }

        // Clean phone number for search - strictly assumes DB has clean numbers or we search partial
        // Better to use contains or clear special chars
        const patients = await db.patient.findMany({
            where: {
                phone: {
                    contains: phone, // Simple fuzzy match for now
                },
            },
            select: {
                id: true,
                name: true,
                status: true,
                createdAt: true,
                phone: true,
            },
            take: 1
        });

        if (patients.length > 0) {
            return NextResponse.json({
                exists: true,
                patient: patients[0]
            });
        }

        return NextResponse.json({
            exists: false,
            patient: null
        });

    } catch (error) {
        console.error("N8N Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
