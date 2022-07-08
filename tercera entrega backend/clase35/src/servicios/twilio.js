const twilio = require("twilio");
const accountSid = "ACe7b91e9e778f086f3057bbc68850f1c5";
const authToken = "f416e69ec4a1da161bcdced97a41ebea";

const client = twilio(accountSid, authToken);

const DEFAULT_NUMBER = "+19362516346";

class Twilio {
  async sendSMS(to, message) {
    try {
      const sentMessage = await client.messages.create({
        body: message,
        from: DEFAULT_NUMBER,
        to,
      });
      console.log(sentMessage);
    } catch (error) {
      console.error(error.message);
    }
  }

  async sendWhatsapp(to, message) {
    try {
      const sentMessage = await client.messages.create({
        body: message,
        from: `whatsapp${DEFAULT_NUMBER}`,
        to: `whatsapp:${to}`,
      });
      console.log(sentMessage);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = new Twilio();
