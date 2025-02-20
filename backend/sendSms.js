require('dotenv').config(); // Load environment variables from .env
const twilio = require('twilio');

// Ensure secrets are only retrieved from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = twilio(accountSid, authToken);

const sendSms = (messageBody, toNumber) => {
  return client.messages
    .create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: toNumber,
    })
    .then((message) => {
      console.log(`Message sent: ${message.sid}`);
      return message.sid;
    })
    .catch((error) => {
      console.error('Error sending SMS:', error.message);
      throw error;
    });
};

module.exports = sendSms;
