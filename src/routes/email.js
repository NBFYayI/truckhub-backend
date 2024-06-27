const express = require("express");
const router = express.Router();
const Mailjet = require("node-mailjet");
const { emailVerify, sendEmail } = require("../controllers/user-control");
router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    //console.log(req);
    const code = req.body.code;
    const reg = await emailVerify(username, code);

    res.status(200).send({
      success: true,
      message: "successfully verified",
      data: reg,
      //res.status(200).send("Verification email sent");
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to verify: " + error.message,
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
router.get("/", async (req, res) => {
  try {
    const username = req.query.username;
    //console.log(req);
    const reg = await sendEmail(username);

    res.status(200).send({
      success: true,
      message: "successfully sent email",
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to send email: " + error.message,
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
