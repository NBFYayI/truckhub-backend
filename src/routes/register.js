const express = require("express");
const router = express.Router();
const { register } = require("../controllers/login-control");

router.post("/", async (req, res) => {
  try {
    const username = req.query.username;
    //console.log(req);
    const password = req.body.password;
    console.log(username);
    console.log(password);
    // const info = await userInfo(username);
    // console.log(info);
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "truckhub1@gmail.com",
        pass: "truckhub123,",
      },
    });

    const mailOptions = {
      from: "truckhub1@gmail.com",
      to: "nbfyayi@gmail.com",
      subject: "Email Verification",
      text: "Please verify your email by clicking on the following link:",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send("Error sending email");
      }
      //res.status(200).send('Verification email sent');
    });
    const reg = await register(username, password);

    res.status(200).send({
      success: true,
      message: "successfully registered",
      data: reg,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to register: " + error.message,
      });
    } else {
      console.error(error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
});

module.exports = router;
