import { NextRequest, NextResponse } from "next/server";
import { getVotersByBooth, getKeyVoters, getVoterDemographics } from "@/lib/services/voters";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const boothId = searchParams.get("booth_id");
    const keyOnly = searchParams.get("key_only");
    const demographics = searchParams.get("demographics");

    try {
        if (demographics === "true") {
            const demo = await getVoterDemographics();
            return NextResponse.json(demo);
        }

        if (keyOnly === "true") {
            const voters = await getKeyVoters(boothId ? Number(boothId) : undefined);
            return NextResponse.json(voters);
        }

        if (!boothId) {
            return NextResponse.json(
                { error: "booth_id is required (or use demographics=true)" },
                { status: 400 }
            );
        }

        const voters = await getVotersByBooth(Number(boothId));
        return NextResponse.json(voters);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch voters" }, { status: 500 });
    }
}
