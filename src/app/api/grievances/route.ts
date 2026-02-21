import { NextRequest, NextResponse } from "next/server";
import {
    getGrievances,
    getGrievanceStats,
    createGrievance,
} from "@/lib/services/grievances";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const boothId = searchParams.get("booth_id");
    const voterId = searchParams.get("voter_id");
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;
    const stats = searchParams.get("stats");
    const limit = searchParams.get("limit");

    try {
        if (stats === "true") {
            const grievanceStats = await getGrievanceStats(
                boothId ? Number(boothId) : undefined
            );
            return NextResponse.json(grievanceStats);
        }

        const grievances = await getGrievances({
            boothId: boothId ? Number(boothId) : undefined,
            voterId: voterId ? Number(voterId) : undefined,
            status,
            category,
            limit: limit ? Number(limit) : undefined,
        });
        return NextResponse.json(grievances);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch grievances" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { voter_id, booth_id, category, title, description, location, photo_url } = body;

        if (!category || !description) {
            return NextResponse.json(
                { error: "category and description are required" },
                { status: 400 }
            );
        }

        const grievance = await createGrievance({
            voter_id,
            booth_id,
            category,
            title,
            description,
            location,
            photo_url,
        });

        if (!grievance) {
            return NextResponse.json({ error: "Failed to create grievance" }, { status: 500 });
        }

        return NextResponse.json(grievance, { status: 201 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to create grievance" }, { status: 500 });
    }
}
