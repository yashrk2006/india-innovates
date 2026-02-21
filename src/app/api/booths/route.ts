import { NextRequest, NextResponse } from "next/server";
import { getBooths, getBoothStats } from "@/lib/services/booths";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const constituencyId = searchParams.get("constituency_id");
    const stats = searchParams.get("stats");

    try {
        if (stats === "true") {
            const boothStats = await getBoothStats(
                constituencyId ? Number(constituencyId) : undefined
            );
            return NextResponse.json(boothStats);
        }

        const booths = await getBooths(
            constituencyId ? Number(constituencyId) : undefined
        );
        return NextResponse.json(booths);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch booths" }, { status: 500 });
    }
}
