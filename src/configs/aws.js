const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const express = require("express");
const app = express();
require("dotenv").config();

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

module.exports = { s3 };
