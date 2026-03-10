import { NextRequest, NextResponse } from "next/server";
import { updateTaskStatus } from "@/lib/services/workers";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "status is required" }, { status: 400 });
        }

        const task = await updateTaskStatus(Number(id), status);
        if (!task) {
            return NextResponse.json({ error: "Failed to update task" }, { status: 400 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}
