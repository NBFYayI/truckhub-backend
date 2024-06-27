const express = require("express");
const router = express.Router();
const { userInfo, login } = require("../controllers/login-control");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../configs/secretKey");

router.post("/", async (req, res) => {
  try {
    const username = req.query.username;
    const password = req.body.password;
    console.log("1");
    console.log(password);
    console.log(username);
    const loginRes = await login(username, password);
    if (lofinRes === 1) {
      res.status(403).send({
        success: false,
        message: "email not verified",
      });
    }
    if (loginRes === 0) {
      const token = jwt.sign({ username: username }, SECRET_KEY, {
        expiresIn: "168h",
      });
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log(decoded);
      //res.json({ token });
      res.status(200).send({
        success: true,
        message: "login success",
        token: { token },
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
