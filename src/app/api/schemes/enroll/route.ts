import { NextRequest, NextResponse } from "next/server";
import { enrollVoterInScheme } from "@/lib/services/schemes";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { voter_id, scheme_id } = body;

        if (!voter_id || !scheme_id) {
            return NextResponse.json(
                { error: "voter_id and scheme_id are required" },
                { status: 400 }
            );
        }

        const success = await enrollVoterInScheme(voter_id, scheme_id);
        if (!success) {
            return NextResponse.json({ error: "Failed to enroll voter" }, { status: 500 });
        }

        return NextResponse.json({ success: true, voter_id, scheme_id }, { status: 200 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to enroll voter" }, { status: 500 });
    }
}
