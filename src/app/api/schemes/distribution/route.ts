import { NextRequest, NextResponse } from "next/server";
import { getSchemes, sendSchemeToVoter } from "@/lib/services/schemes";
import { getVotersByBooth } from "@/lib/services/voters";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    try {
        if (type === "schemes") {
            const schemes = await getSchemes();
            return NextResponse.json(schemes);
        }

        const boothId = searchParams.get("booth_id");
        if (boothId) {
            const voters = await getVotersByBooth(Number(boothId));
            return NextResponse.json(voters);
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { voterId, schemeId } = body;

        console.log("[API/Schemes/Distribution] Request:", { voterId, schemeId });

        if (!voterId || !schemeId) {
            return NextResponse.json({ error: "voterId and schemeId are required" }, { status: 400 });
        }

        const success = await sendSchemeToVoter(voterId, schemeId);
        if (success) {
            console.log("[API/Schemes/Distribution] Success for voter:", voterId);
            return NextResponse.json({ success: true });
        } else {
            console.error("[API/Schemes/Distribution] sendSchemeToVoter returned false");
            return NextResponse.json({ error: "Failed to send scheme (Service error)" }, { status: 500 });
        }
    } catch (error: any) {
        console.error("[API/Schemes/Distribution] Catch error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
