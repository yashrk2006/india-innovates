import { NextRequest, NextResponse } from "next/server";
import { getVoterSentiment } from "@/lib/services/voters";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const constituencyId = searchParams.get("constituency_id");

    try {
        const sentiment = await getVoterSentiment(
            constituencyId ? Number(constituencyId) : undefined
        );
        return NextResponse.json(sentiment);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch sentiment" }, { status: 500 });
    }
}
