require('dotenv').config();
const { sendSMS } = require('./services/notificationService');

const targetPhone = process.argv[2];

if (!targetPhone) {
  console.error('❌ Please provide a target phone number to test with.');
  console.log('Usage: node testSMS.js <phone_number>');
  process.exit(1);
}

console.log(`📡 Sending test SMS to: ${targetPhone}...`);

sendSMS(targetPhone, 'Hello from BoothIQ! Your Twilio SMS integration is working correctly. 🚀')
  .then((result) => {
    if (result.success) {
      console.log(`✅ Success! Message SID: ${result.sid}`);
    } else {
      console.error(`❌ Failed! Error: ${result.error}`);
      if (result.error.includes('verified')) {
        console.log('\n💡 Tip: Since you are likely using a Twilio trial account, you must first "verify" your personal phone number in the Twilio dashboard as a "Verified Caller ID" to send messages to it.');
      }
    }
  })
  .catch((err) => {
    console.error('💥 Unexpected Error:', err.message);
  });
