const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const username = req.query.username;
    console.log(req);
    const password = req.body.password;
    console.log(password);
    console.log(username);
    res.status(200).send({
      success: true,
      message: "fuckyou",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
