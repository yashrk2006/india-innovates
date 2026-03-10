import { NextRequest, NextResponse } from "next/server";
import { updateGrievanceStatus } from "@/lib/services/grievances";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { status, assigned_to, resolution_note } = body;

        if (!status) {
            return NextResponse.json({ error: "status is required" }, { status: 400 });
        }

        const grievance = await updateGrievanceStatus(Number(id), {
            status,
            assigned_to,
            resolution_note,
        });

        if (!grievance) {
            return NextResponse.json({ error: "Failed to update grievance" }, { status: 400 });
        }

        return NextResponse.json(grievance);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to update grievance" }, { status: 500 });
    }
}
