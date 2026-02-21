import { NextRequest, NextResponse } from "next/server";
import { getDashboardKPIs, getActivitySummary } from "@/lib/services/reports";
import { getSchemeGaps } from "@/lib/services/schemes";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || undefined;
    const type = searchParams.get("type");

    try {
        if (type === "scheme_gaps") {
            const gaps = await getSchemeGaps();
            return NextResponse.json(gaps);
        }

        if (type === "activity") {
            const days = Number(searchParams.get("days") || "7");
            const activity = await getActivitySummary(days);
            return NextResponse.json(activity);
        }

        const kpis = await getDashboardKPIs(role);
        return NextResponse.json(kpis);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
