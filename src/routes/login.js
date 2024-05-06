const express = require("express");
const router = express.Router();
const { userInfo, login } = require("../controllers/loginControl");

router.post("/", async (req, res) => {
  try {
    const username = req.query.username;
    //console.log(req);
    const password = req.body.password;
    console.log(password);
    console.log(username);
    // const info = await userInfo(username);
    // console.log(info);
    const loginRes = await login(username, password);
    if (loginRes == 0) {
      res.status(200).send({
        success: true,
        message: "login success",
      });
    } else if (loginRes == 1) {
      res.status(400).send({
        success: false,
        message: "login failed: username not found",
      });
    } else if (loginRes == 2) {
      res.status(403).send({
        success: false,
        message: "login failed: incorrect password",
      });
    } else {
      throw new Error("not sure what happened");
    }
  } catch (error) {
    if (error.code == "400") {
      res.status(400).send({
        success: false,
        message: "login failed: username not found",
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
