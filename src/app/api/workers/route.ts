import { NextRequest, NextResponse } from "next/server";
import { getBoothWorkers, getWorkerStats } from "@/lib/services/workers";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const boothId = searchParams.get("booth_id");
    const stats = searchParams.get("stats");

    try {
        if (stats === "true") {
            const workerStats = await getWorkerStats();
            return NextResponse.json(workerStats);
        }

        const workers = await getBoothWorkers(
            boothId ? Number(boothId) : undefined
        );
        return NextResponse.json(workers);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch workers" }, { status: 500 });
    }
}
