import { NextRequest, NextResponse } from "next/server";
import { getActivityLog } from "@/lib/services/workers";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("worker_id") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20;

    try {
        const activities = await getActivityLog(workerId, limit);
        return NextResponse.json(activities);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch activity log" }, { status: 500 });
    }
}
