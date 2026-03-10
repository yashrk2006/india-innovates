import { NextRequest, NextResponse } from "next/server";
import { getWorkerTasks, createWorkerTask } from "@/lib/services/workers";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("worker_id") || undefined;
    const status = searchParams.get("status") || undefined;

    try {
        const tasks = await getWorkerTasks(workerId, status);
        return NextResponse.json(tasks);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { assigned_to, assigned_by, booth_id, title, description, due_date, priority } = body;

        if (!assigned_to || !assigned_by || !title) {
            return NextResponse.json(
                { error: "assigned_to, assigned_by, and title are required" },
                { status: 400 }
            );
        }

        const task = await createWorkerTask({
            assigned_to,
            assigned_by,
            booth_id,
            title,
            description,
            due_date,
            priority,
        });

        if (!task) {
            return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
        }

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}
