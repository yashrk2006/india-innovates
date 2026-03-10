import { NextRequest, NextResponse } from "next/server";
import { updateCampaignStatus } from "@/lib/services/campaigns";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { status, approved_by, flagged_reason } = body;

        if (!status) {
            return NextResponse.json({ error: "status is required" }, { status: 400 });
        }

        const campaign = await updateCampaignStatus(Number(id), status, {
            approved_by,
            flagged_reason,
        });

        if (!campaign) {
            return NextResponse.json({ error: "Failed to update campaign" }, { status: 400 });
        }

        return NextResponse.json(campaign);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
    }
}
