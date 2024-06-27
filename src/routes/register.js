const express = require("express");
const router = express.Router();
const { register } = require("../controllers/user-control");
router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    //console.log(req);
    const password = req.body.password;
    const email = req.body.email;
    if (!username || !password || !email) {
      res.status(400).send({
        success: false,
        message: "must contain username, password, and email",

        //res.status(200).send("Verification email sent");
      });
    }
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
