const nodemailer = require("nodemailer");
const { transporter } = require("../../connections/mailer");

class MailService {
  sendEmail(username, email, code) {
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
  }
}

const mailService = new MailService();
module.exports = { mailService };
