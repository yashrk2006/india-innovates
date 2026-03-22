import { NextRequest, NextResponse } from "next/server";
import { SarvamService } from "@/lib/services/sarvam";

/**
 * POST /api/ai/analyze
 * Handles text analysis and translation using Sarvam AI.
 * Primarily uses the translation engine for Indian languages.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, source_language_code, target_language_code } = body;

        // Basic validation
        if (!text) {
            return NextResponse.json(
                { error: "Invalid request: 'text' field is required." },
                { status: 400 }
            );
        }

        const result = await SarvamService.translate(
            text,
            source_language_code || "hi-IN", // Default Hindi
            target_language_code || "en-IN" // Default English
        );
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI Analyze API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
