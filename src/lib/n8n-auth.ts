import { NextRequest, NextResponse } from "next/server";

export function checkN8NAuth(req: NextRequest) {
    const apiKey = req.headers.get("x-api-key");
    const validKey = process.env.N8N_API_KEY;

    if (!validKey || apiKey !== validKey) {
        return false;
    }
    return true;
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
