const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/user-control");

const profileVerify = require("../middleware/profileRoute");
router.get("/", async (req, res) => {
  try {
    const username = req.query.username;
    console.log(username);
    const doc = await getProfile(username);
    res.status(200).send({
      success: true,
      message: "profile loaded",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "cannot get profile: " + error.message,
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

router.post("/", profileVerify, async (req, res) => {
  try {
    const username = req.body.username;
    //console.log(req);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const occupation = req.body.occupation;
    const nickname = req.body.nickname;
    console.log(username);
    // const info = await userInfo(username);
    // console.log(info);
    const doc = await updateProfile(
      username,
      firstName,
      lastName,
      occupation,
      nickname
    );

    res.status(200).send({
      success: true,
      message: "update success",
      data: doc,
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
