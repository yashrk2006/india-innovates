const express = require('express');
const router = express.Router();
const { generateOTP, validateOTP } = require('../services/verificationService');
const { sendSMS } = require('../services/notificationService');

/**
 * @route   POST /api/verify/otp
 * @desc    Generate and send OTP for verification
 * @access  Private (Simulated)
 */
router.post('/otp', async (req, res) => {
    const { identifier, type } = req.body; // type: 'aadhaar' or 'voter'

    if (!identifier) {
        return res.status(400).json({ error: 'Identifier (phone/email) is required' });
    }

    try {
        const otp = generateOTP(identifier);
        
        // For production, we would send a real SMS/Email here.
        // For the trial environment, we'll log it and try to send if possible.
        // Note: We'll include the OTP in the response for DEMO PURPOSES ONLY.
        
        await sendSMS(identifier, `Your BoothIQ Identity Verification OTP is: ${otp}. Do not share this with anyone.`);

        res.json({
            success: true,
            message: `OTP sent to ${identifier}`,
            otp: otp // Included for ease of testing in this demo environment
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

/**
 * @route   POST /api/verify/confirm
 * @desc    Validate OTP and return verification status
 * @access  Private (Simulated)
 */
router.post('/confirm', async (req, res) => {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
        return res.status(400).json({ error: 'Identifier and OTP are required' });
    }

    const isValid = validateOTP(identifier, otp);

    if (isValid) {
        res.json({
            success: true,
            message: 'Identity verified successfully',
            verificationToken: `vtoken_${Date.now()}` // Mock token
        });
    } else {
        res.status(401).json({ error: 'Invalid or expired OTP' });
    }
});

module.exports = router;
