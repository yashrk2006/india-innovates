import { NextRequest, NextResponse } from "next/server";
import { getBoothById, updateBooth } from "@/lib/services/booths";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const booth = await getBoothById(Number(id));
        if (!booth) {
            return NextResponse.json({ error: "Booth not found" }, { status: 404 });
        }
        return NextResponse.json(booth);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch booth" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const updated = await updateBooth(Number(id), body);
        if (!updated) {
            return NextResponse.json({ error: "Failed to update booth" }, { status: 400 });
        }
        return NextResponse.json(updated);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to update booth" }, { status: 500 });
    }
}
