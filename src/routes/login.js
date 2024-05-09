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
    if (loginRes === 0) {
      res.status(200).send({
        success: true,
        message: "login success",
      });
    } else {
      throw new Error("not sure what happened in login controller");
    }
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "login failed: " + error.message,
      });
    }
    // else if(error.code == "404"){
    //   res.status(404).send({
    //     success: false,
    //     message: "login failed: " + error.message,
    //   });
    // }
    else {
      console.error(error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
});

module.exports = router;
