import { NextRequest, NextResponse } from "next/server";
import { SarvamService } from "@/lib/services/sarvam";

/**
 * POST /api/ai/docs
 * Handles document processing and OCR using Sarvam AI.
 * Note: This implementation expects a file_url for the document.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { file_url } = body;

        // Basic validation
        if (!file_url) {
            return NextResponse.json(
                { error: "Invalid request: 'file_url' field is required." },
                { status: 400 }
            );
        }

        const result = await SarvamService.ocr(file_url);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI Docs API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
