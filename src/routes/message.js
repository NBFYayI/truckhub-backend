const express = require("express");
const {
  getConvs,
  getMessage,
  sendMessage,
} = require("../controllers/message-control");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const username = req.query.username;
    //console.log(req);
    const docs = await getConvs(username);

    res.status(200).send({
      success: true,
      message: "successfully retrieved conversations",
      data: docs,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to get conversations: " + error.message,
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

router.post("/", async (req, res) => {
  try {
    const user1 = req.body.user1;
    const user2 = req.body.user2;
    if (user1 === user2) {
      res.status(400).send({
        success: false,
        message: "usernames cannot be the same",
      });
    }
    const skip = req.body.skip ? req.body.skip : 0;
    const limit = req.body.limit ? req.body.limit : 10;
    const docs = await getMessage(user1, user2, skip, limit);

    res.status(200).send({
      success: true,
      message: "successfully retrieved messages",
      data: docs,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to get messages: " + error.message,
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

router.post("/send", async (req, res) => {
  try {
    const user1 = req.body.src;
    const user2 = req.body.dest;
    if (user1 === user2) {
      res.status(400).send({
        success: false,
        message: "usernames cannot be the same",
      });
    }
    const content = req.body.content;
    if (content.trim().length() < 1) {
      res.status(400).send({
        success: false,
        message: "content cannot be empty",
      });
    }
    const docs = await sendMessage(user1, user2, content);

    res.status(200).send({
      success: true,
      message: "successfully sent message",
      data: docs,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to get messages: " + error.message,
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
