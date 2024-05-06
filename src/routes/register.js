const express = require("express");
const router = express.Router();
const { register } = require("../controllers/loginControl");

router.post("/", async (req, res) => {
  try {
    const username = req.query.username;
    //console.log(req);
    const password = req.body.password;
    console.log(username);
    console.log(password);
    // const info = await userInfo(username);
    // console.log(info);
    const reg = await register(username, password);
    if (reg == 1) {
      res.status(400).send({
        success: false,
        message: "username already exists",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "successfully registered",
        data: reg,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
