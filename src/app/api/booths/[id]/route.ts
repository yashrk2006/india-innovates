import { NextRequest, NextResponse } from "next/server";
import { getBoothById, updateBooth } from "@/lib/services/booths";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const booth = await getBoothById(Number(params.id));
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
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const updated = await updateBooth(Number(params.id), body);
        if (!updated) {
            return NextResponse.json({ error: "Failed to update booth" }, { status: 400 });
        }
        return NextResponse.json(updated);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to update booth" }, { status: 500 });
    }
}
