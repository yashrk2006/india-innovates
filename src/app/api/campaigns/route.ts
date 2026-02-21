import { NextRequest, NextResponse } from "next/server";
import { getCampaigns, createCampaign } from "@/lib/services/campaigns";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    try {
        const campaigns = await getCampaigns(status);
        return NextResponse.json(campaigns);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, created_by, constituency_id, segments, target_type, estimated_reach, type, theme, scheduled_at } = body;

        if (!name || !created_by) {
            return NextResponse.json(
                { error: "name and created_by are required" },
                { status: 400 }
            );
        }

        const campaign = await createCampaign({
            name,
            created_by,
            constituency_id,
            segments,
            target_type,
            estimated_reach,
            type,
            theme,
            scheduled_at,
        });

        if (!campaign) {
            return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
        }

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
    }
}
