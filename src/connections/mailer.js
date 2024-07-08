const nodemailer = require("nodemailer");
const { mailuser, mailpass } = require("../configs/secretKey");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: mailuser,
    pass: mailpass,
  },
});

module.exports = { transporter };
