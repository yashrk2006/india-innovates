const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { sendSMS, sendWhatsApp, sendEmail } = require('./services/notificationService');

const targetPhone = process.argv[2];
const targetEmail = process.argv[3];

if (!targetPhone || !targetEmail) {
  console.error('❌ Please provide both a target phone number and an email address.');
  console.log('Usage: node testNotifications.js <phone_number> <email@example.com>');
  process.exit(1);
}

console.log(`📡 Initializing Multi-Channel Test...`);
console.log(`📱 Phone: ${targetPhone}`);
console.log(`✉️ Email: ${targetEmail}\n`);

async function runTests() {
  // 1. Test SMS
  console.log('--- Testing SMS ---');
  const smsResult = await sendSMS(targetPhone, 'BoothIQ: Test SMS Success! 🚀');
  if (smsResult.success) {
    console.log(`✅ SMS Sent! SID: ${smsResult.sid}`);
  } else {
    console.error(`❌ SMS Failed: ${smsResult.error}`);
  }

  // 2. Test WhatsApp
  console.log('\n--- Testing WhatsApp ---');
  console.log('💡 Note: You must join the Twilio WhatsApp Sandbox first for this to work!');
  const waResult = await sendWhatsApp(targetPhone, 'BoothIQ: Test WhatsApp Success! 🗳️');
  if (waResult.success) {
    console.log(`✅ WhatsApp Sent! SID: ${waResult.sid}`);
  } else {
    console.error(`❌ WhatsApp Failed: ${waResult.error}`);
  }

  // 3. Test Email
  console.log('\n--- Testing Email ---');
  const emailResult = await sendEmail(
    targetEmail, 
    'BoothIQ: Test Email Success!', 
    'Greetings! Your SendGrid email integration is working perfectly. 🚀',
    '<h1>Welcome to BoothIQ!</h1><p>Your SendGrid email integration is working perfectly. 🚀</p>'
  );
  if (emailResult.success) {
    console.log(`✅ Email Sent Successfully to ${targetEmail}`);
  } else {
    console.error(`❌ Email Failed: ${emailResult.error}`);
    console.log('💡 Tip: Ensure your SENDGRID_FROM_EMAIL is verified in the SendGrid dashboard.');
  }
}

runTests().then(() => {
  console.log('\n🏁 Test suite finished.');
}).catch(err => {
  console.error('💥 Fatal Test Error:', err.message);
});
