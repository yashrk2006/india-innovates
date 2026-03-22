import { NextRequest, NextResponse } from "next/server";
import { SarvamService } from "@/lib/services/sarvam";

/**
 * POST /api/ai/chat
 * Handles conversational AI requests using Sarvam AI.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, options } = body;

        // Basic validation
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid request: 'messages' array is required." },
                { status: 400 }
            );
        }

        const result = await SarvamService.chat(messages, options);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI Chat API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
