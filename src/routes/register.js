const express = require("express");
const router = express.Router();
const { register } = require("../controllers/user-control");
const Mailjet = require("node-mailjet");
router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    //console.log(req);
    const password = req.body.password;
    const email = req.body.email;
    const nickname = req.body.nickname;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const occupation = req.body.occupation;
    console.log(username);
    console.log(password);
    // const info = await userInfo(username);
    // console.log(info);

    const reg = await register(
      username,
      password,
      email,
      nickname,
      firstname,
      lastname,
      occupation
    );

    const con = new Mailjet({
      apiKey: "ec74b93ae59da875ea67bb292b5bcde0",
      apiSecret: "8ca842549fb9437c509c2b6cd6b78f68",
    });
    const request = con.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "truckhub1@gmail.com",
            Name: "Me",
          },
          To: [
            {
              Email: "nbfyayi@gmail.com",
              Name: "You",
            },
          ],
          Subject: "My first Mailjet Email!",
          TextPart: "Greetings from Mailjet!",
          HTMLPart:
            '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
        },
      ],
    });
    request
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
    res.status(200).send({
      success: true,
      message: "successfully registered",
      data: reg,
      //res.status(200).send("Verification email sent");
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
