import { NextRequest, NextResponse } from "next/server";
import { getSchemes } from "@/lib/services/schemes";

export async function GET() {
    try {
        const schemes = await getSchemes();
        return NextResponse.json(schemes);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch schemes" }, { status: 500 });
    }
}
