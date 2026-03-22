const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const notificationService = require('../services/notificationService');

/**
 * Endpoint to send an SMS.
 * POST /api/notifications/sms
 */
router.post(
    '/sms',
    [
        body('to').notEmpty().withMessage('Recipient number is required'),
        body('message').notEmpty().withMessage('Message body is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { to, message } = req.body;
        const result = await notificationService.sendSMS(to, message);

        if (result.success) {
            return res.json({ message: 'SMS sent successfully', sid: result.sid });
        } else {
            return res.status(500).json({ error: result.error });
        }
    }
);

/**
 * Endpoint to send a WhatsApp message.
 * POST /api/notifications/whatsapp
 */
router.post(
    '/whatsapp',
    [
        body('to').notEmpty().withMessage('Recipient number is required'),
        body('message').notEmpty().withMessage('Message body is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { to, message } = req.body;
        const result = await notificationService.sendWhatsApp(to, message);

        if (result.success) {
            return res.json({ message: 'WhatsApp message sent successfully', sid: result.sid });
        } else {
            return res.status(500).json({ error: result.error });
        }
    }
);

/**
 * Endpoint to send an Email.
 * POST /api/notifications/email
 */
router.post(
    '/email',
    [
        body('to').isEmail().withMessage('Valid recipient email is required'),
        body('subject').notEmpty().withMessage('Subject is required'),
        body('text').notEmpty().withMessage('Message body is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { to, subject, text, html } = req.body;
        const result = await notificationService.sendEmail(to, subject, text, html);

        if (result.success) {
            return res.json({ message: 'Email sent successfully' });
        } else {
            return res.status(500).json({ error: result.error });
        }
    }
);

module.exports = router;
