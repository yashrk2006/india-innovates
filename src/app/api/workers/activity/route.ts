import { NextRequest, NextResponse } from "next/server";
import { logWorkerActivity } from "@/lib/services/workers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { worker_id, activity_type, reference_id, notes } = body;

        if (!worker_id || !activity_type) {
            return NextResponse.json(
                { error: "worker_id and activity_type are required" },
                { status: 400 }
            );
        }

        const activity = await logWorkerActivity({
            worker_id,
            activity_type,
            reference_id,
            notes,
        });

        if (!activity) {
            return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
        }

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
    }
}
