import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  if (!checkN8NAuth(req)) {
    return unauthorizedResponse();
  }

  try {
    // Extract patient ID from route params (async in Next.js 16)
    const { id } = await params;

    // Verify patient exists
    const patient = await db.patient.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const statusParam = searchParams.get("status");
    const limitParam = searchParams.get("limit");

    // Validate and apply limit (default: 10, max: 50)
    let limit = 10;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = Math.min(parsedLimit, 50);
      }
    }

    // Build where clause
    const where: {
      patientId: string;
      status?: string;
    } = {
      patientId: id,
    };

    // Add status filter if provided
    if (statusParam) {
      where.status = statusParam;
    }

    // Fetch appointments
    const [appointments, total] = await Promise.all([
      db.appointment.findMany({
        where,
        select: {
          id: true,
          date: true,
          time: true,
          status: true,
          type: true,
          location: true,
          notes: true,
        },
        orderBy: {
          date: "desc",
        },
        take: limit,
      }),
      db.appointment.count({ where }),
    ]);

    return NextResponse.json({
      appointments,
      total,
    });
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
