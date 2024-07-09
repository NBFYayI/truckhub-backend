const nodemailer = require("nodemailer");
const { transporter } = require("../../connections/mailer");

class MailService {
  sendEmail(username, email, code) {
    try {
      transporter.sendMail({
        to: email,
        subject: "Truckhub Verify",
        text:
          "Hi " +
          username +
          ", your verification code is " +
          code +
          ". The code will expire in 10 minutes.",
      });
    } catch (error) {
      const e = new Error("email not valid:" + email);
      e.code = 400;
      throw e;
    }
  }
}

const mailService = new MailService();
module.exports = { mailService };
