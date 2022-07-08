const nodemailer = require("nodemailer");

const CONFIG = require("../config");

const { ADMIN_EMAIL } = CONFIG;

const MAIL_USER = "ruben.bosco70@ethereal.email";
const MAIL_PASSWORD = "JuPJpHT4kbqGJvv7RE";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

class Mails {
  sendToAdmin(subject, html) {
    return this.sendMail(ADMIN_EMAIL, subject, html);
  }

  async sendMail(to, subject, html) {
    try {
      const options = { from: MAIL_USER, to, subject, html };
      console.log(options);
      const result = await transporter.sendMail(options);
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Mails();
