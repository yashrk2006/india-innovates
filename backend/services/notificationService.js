const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client only if credentials exist to prevent crashes
let client;
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

/**
 * Sends an SMS notification to a citizen.
 * @param {string} to - The recipient's phone number (with country code).
 * @param {string} message - The message body.
 */
const sendSMS = async (to, message) => {
    if (!client) {
        console.warn('⚠️ Twilio credentials missing. SMS not sent.');
        return { success: false, error: 'Twilio credentials not configured' };
    }

    try {
        const result = await client.messages.create({
            body: message,
            from: twilioNumber,
            to: to
        });
        console.log(`✅ SMS sent successfully: ${result.sid}`);
        return { success: true, sid: result.sid };
    } catch (error) {
        console.error(`❌ Error sending SMS to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Sends a WhatsApp notification to a citizen.
 * @param {string} to - The recipient's phone number (with country code).
 * @param {string} message - The message body.
 */
const sendWhatsApp = async (to, message) => {
    if (!client) {
        console.warn('⚠️ Twilio credentials missing. WhatsApp not sent.');
        return { success: false, error: 'Twilio credentials not configured' };
    }

    try {
        // WhatsApp numbers must be prefixed with 'whatsapp:' in Twilio
        const result = await client.messages.create({
            body: message,
            from: `whatsapp:${twilioNumber}`,
            to: `whatsapp:${to}`
        });
        console.log(`✅ WhatsApp sent successfully: ${result.sid}`);
        return { success: true, sid: result.sid };
    } catch (error) {
        console.error(`❌ Error sending WhatsApp to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendSMS,
    sendWhatsApp
};
