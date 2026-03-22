const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

// Twilio Config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// SendGrid Config
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@boothiq.com';

// Initialize Clients
let twilioClient;
if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
}

if (sendgridApiKey) {
    sgMail.setApiKey(sendgridApiKey);
}

/**
 * Sends an SMS notification to a citizen.
 */
const sendSMS = async (to, message) => {
    if (!twilioClient) {
        console.warn('⚠️ Twilio credentials missing. SMS not sent.');
        return { success: false, error: 'Twilio credentials not configured' };
    }

    try {
        const result = await twilioClient.messages.create({
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
 */
const sendWhatsApp = async (to, message) => {
    if (!twilioClient) {
        console.warn('⚠️ Twilio credentials missing. WhatsApp not sent.');
        return { success: false, error: 'Twilio credentials not configured' };
    }

    try {
        const result = await twilioClient.messages.create({
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

/**
 * Sends an Email notification to a citizen via SendGrid.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The email subject.
 * @param {string} text - The plain text body.
 * @param {string} html - The HTML body (optional).
 */
const sendEmail = async (to, subject, text, html) => {
    if (!sendgridApiKey) {
        console.warn('⚠️ SendGrid API key missing. Email not sent.');
        return { success: false, error: 'SendGrid credentials not configured' };
    }

    const msg = {
        to: to,
        from: fromEmail,
        subject: subject,
        text: text,
        html: html || text,
    };

    try {
        await sgMail.send(msg);
        console.log(`✅ Email sent successfully to ${to}`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendSMS,
    sendWhatsApp,
    sendEmail
};
