const express = require("express");
const router = express.Router();
require("dotenv").config();

const {
  getProfile,
  updateProfile,
  changePassword,
  changeEmail,
  getEmail,
  updateAvatar,
} = require("../controllers/user-control");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const profileVerify = require("../middleware/profileRoute");
const { s3 } = require("../configs/aws");
const avatarVerify = require("../middleware/avatarAuth");
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

router.post("/account", profileVerify, async (req, res) => {
  try {
    const username = req.body.username;

    const doc = await getEmail(username);
    res.status(200).send({
      success: true,
      message: "success",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to get info: " + error.message,
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
    const { username, firstName, lastName, nickname, occupation } = req.body;
    if (!username) {
      res.status(400).send({
        success: false,
        message: "failed to update profile: username cannot be empty",
      });
      return;
    }

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
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to update profile: " + error.message,
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

router.post(
  "/avatar",
  avatarVerify,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { username } = req.query;
      if (!username) {
        res.status(400).send({
          success: false,
          message: "failed to update avatar: username cannot be empty",
        });
        return;
      }

      // const info = await userInfo(username);
      // console.log(info);
      const avatarURL = `avatars/${Date.now()}_${req.file.originalname}`;
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: avatarURL, // File name you want to save as in S3
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const uploadToS3 = (params) => {
        return new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => {
            if (err) {
              const e = new Error("Failed to upload image.");
              e.code = 500;
              return reject(e);
            }
            resolve(data);
          });
        });
      };
      const data = await uploadToS3(params);

      console.log(`File uploaded successfully. ${data.Location}`);

      const doc = await updateAvatar(
        username,

        avatarURL
      );
      if (doc.avatarURL) {
        const delparams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: doc.avatarURL, // File name you want to save as in S3
        };
        s3.deleteObject(delparams, function (err, data) {
          if (err) console.log(err); // an error occurred
        });
      }

      res.status(200).send({
        success: true,
        message: "update success",
        data: doc,
      });
    } catch (error) {
      if (error.code) {
        res.status(error.code).send({
          success: false,
          message: "failed to update profile: " + error.message,
        });
      } else {
        console.error(error.message);
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    }
  }
);

router.post("/password", profileVerify, async (req, res) => {
  try {
    const username = req.body.username;
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    const doc = await changePassword(username, oldPass, newPass);

    res.status(200).send({
      success: true,
      message: "password change success",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to change password: " + error.message,
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

router.post("/email", profileVerify, async (req, res) => {
  try {
    const username = req.body.username;

    const email = req.body.email;
    const doc = await changeEmail(username, email);

    res.status(200).send({
      success: true,
      message: "email change success",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to change email: " + error.message,
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
