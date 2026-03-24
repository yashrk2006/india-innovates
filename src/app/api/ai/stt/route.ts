import { NextRequest, NextResponse } from "next/server";
import { SarvamService } from "@/lib/services/sarvam";

/**
 * POST /api/ai/stt
 * Handles Speech-to-Text requests using Sarvam AI.
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get("audio") as Blob;
        const languageCode = formData.get("language_code") as string || "hi-IN";

        if (!audioFile) {
            return NextResponse.json(
                { error: "Audio file is required" },
                { status: 400 }
            );
        }

        const result = await SarvamService.speechToText(audioFile, languageCode);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI STT API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
