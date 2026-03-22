/**
 * Sarvam AI Service
 * Handles integration with Sarvam AI APIs for Chat, Translation, and OCR.
 */

const CHAT_API_URL = "https://api.sarvam.ai/v1/chat/completions";
const TRANSLATE_API_URL = "https://api.sarvam.ai/translate";
const OCR_API_URL = "https://api.sarvam.ai/v1/ocr"; // Placeholder until exact verified
const API_KEY = process.env.SARVAM_API_KEY;

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface SarvamChatOptions {
    model?: string;
    temperature?: number;
}

export const SarvamService = {
    /**
     * Chat Completion using Sarvam AI
     */
    async chat(messages: ChatMessage[], options: SarvamChatOptions = {}) {
        if (!API_KEY) throw new Error("SARVAM_API_KEY is not configured");

        const response = await fetch(CHAT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": API_KEY, // Sarvam uses this header
            },
            body: JSON.stringify({
                model: options.model || "sarvam-30b",
                messages,
                temperature: options.temperature ?? 0.7,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Sarvam Chat API error: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Translate text (used for Analyze endpoint)
     */
    async translate(text: string, source_language_code: string, target_language_code: string) {
        if (!API_KEY) throw new Error("SARVAM_API_KEY is not configured");

        const response = await fetch(TRANSLATE_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": API_KEY,
            },
            body: JSON.stringify({
                input: text,
                source_language_code,
                target_language_code,
                speaker_gender: "Male", // Default required by some Sarvam endpoints
                mode: "formal",
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Sarvam Translation API error: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Optical Character Recognition (used for Docs endpoint)
     */
    async ocr(fileUrl: string) {
        if (!API_KEY) throw new Error("SARVAM_API_KEY is not configured");

        const response = await fetch(OCR_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": API_KEY,
            },
            body: JSON.stringify({
                file_url: fileUrl,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Sarvam OCR API error: ${response.status}`);
        }

        return response.json();
    },
};
