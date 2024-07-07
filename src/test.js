const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "truckhub1@gmail.com",
    pass: "efwvkzvriracygla",
  },
});

transporter.sendMail({
  to: "nbfyayi@gmail.com",
  subject: "Hello",
  text: "Fuck youuuuuuuuuu",
});
