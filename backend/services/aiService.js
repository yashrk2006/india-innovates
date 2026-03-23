// const fetch = require('node-fetch'); // Using built-in fetch in Node 18+

const CHAT_API_URL = "https://api.sarvam.ai/v1/chat/completions";
const TRANSLATE_API_URL = "https://api.sarvam.ai/translate";
const OCR_API_URL = "https://api.sarvam.ai/v1/ocr"; 
const STT_API_URL = "https://api.sarvam.ai/speech-to-text";

const getApiKey = () => process.env.SARVAM_API_KEY;

const aiService = {
    /**
     * Chat Completion using Sarvam AI
     */
    async chat(messages, options = {}) {
        const API_KEY = getApiKey();
        if (!API_KEY) throw new Error("SARVAM_API_KEY is not configured");

        const response = await fetch(CHAT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": API_KEY,
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
     * Translate text / Analyze
     */
    async translate(text, source_language_code, target_language_code) {
        const API_KEY = getApiKey();
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
                speaker_gender: "Male",
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
     * OCR / Docs
     */
    async ocr(fileUrl) {
        const API_KEY = getApiKey();
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

    /**
     * Speech-to-Text (STT) using Sarvam AI
     * @param {Buffer} audioBuffer - The raw audio data.
     * @param {string} languageCode - The language of the audio (e.g., 'hi-IN', 'en-IN').
     */
    async speechToText(audioBuffer, languageCode = 'hi-IN') {
        const API_KEY = getApiKey();
        if (!API_KEY) throw new Error("SARVAM_API_KEY is not configured");

        const formData = new FormData();
        const blob = new Blob([audioBuffer], { type: 'audio/wav' });
        formData.append('file', blob, 'audio.wav');
        formData.append('model', 'saaras:v1');
        formData.append('language_code', languageCode);

        const response = await fetch(STT_API_URL, {
            method: "POST",
            headers: {
                "api-subscription-key": API_KEY,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error("Sarvam STT Full Error:", JSON.stringify(error, null, 2));
            throw new Error(error.message || `Sarvam STT API error: ${response.status}`);
        }

        return response.json();
    },
};

module.exports = aiService;
