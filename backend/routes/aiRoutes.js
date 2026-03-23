const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { body, validationResult } = require('express-validator');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }
    next();
};

/**
 * POST /api/ai/chat
 * Endpoint for conversational AI
 */
router.post('/chat', [
    body('messages').isArray().withMessage('Messages must be an array'),
    body('messages.*.role').isIn(['user', 'assistant', 'system']).withMessage('Invalid message role'),
    body('messages.*.content').isString().notEmpty().withMessage('Message content is required'),
], validate, async (req, res) => {
    try {
        const { messages, options } = req.body;
        const result = await aiService.chat(messages, options);
        res.json(result);
    } catch (error) {
        console.error("Backend Chat Error:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

/**
 * POST /api/ai/analyze
 * Endpoint for text analysis/translation
 */
router.post('/analyze', [
    body('text').isString().notEmpty().withMessage('Text is required'),
    body('source_language_code').isString().optional(),
    body('target_language_code').isString().optional(),
], validate, async (req, res) => {
    try {
        const { text, source_language_code = 'en-IN', target_language_code = 'hi-IN' } = req.body;
        const result = await aiService.translate(text, source_language_code, target_language_code);
        res.json(result);
    } catch (error) {
        console.error("Backend Analyze Error:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

/**
 * POST /api/ai/docs
 * Endpoint for Document OCR/Parsing
 */
router.post('/docs', [
    body('fileUrl').isURL().withMessage('Valid fileUrl is required'),
], validate, async (req, res) => {
    try {
        const { fileUrl } = req.body;
        const result = await aiService.ocr(fileUrl);
        res.json(result);
    } catch (error) {
        console.error("Backend Docs Error:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

/**
 * POST /api/ai/stt
 * Endpoint for Speech-to-Text
 */
router.post('/stt', upload.single('audio'), async (req, res) => {
    console.log(`[STT] Request received. File present: ${!!req.file}, Language: ${req.body.language_code}`);
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Audio file is required" });
        }

        const { language_code = 'hi-IN' } = req.body;
        const result = await aiService.speechToText(req.file.buffer, language_code);
        
        res.json(result);
    } catch (error) {
        const path = require('path');
        const errorMsg = `[${new Date().toISOString()}] Backend STT Error: ${error.message}\n`;
        try {
            require('fs').appendFileSync(path.join(__dirname, 'error.log'), errorMsg);
        } catch (e) {
            console.error("Error Log Write Error:", e.message);
        }
        console.error("Backend STT Error:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

module.exports = router;
