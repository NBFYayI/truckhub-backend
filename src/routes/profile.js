const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profile-control");

router.get("/", async (req, res) => {
  try {
    const username = req.query.username;
    console.log(username);
    const doc = await getProfile(username);
    if (doc.length == 0) {
      res.status(404).send({
        success: false,
        message: "failed to get profile: username does not exist",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "profile loaded",
        data: doc[0],
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

router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    //console.log(req);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const occupation = req.body.occupation;
    const email = req.body.email;
    console.log(username);
    // const info = await userInfo(username);
    // console.log(info);
    const doc = await updateProfile(
      username,
      firstName,
      lastName,
      occupation,
      email
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
