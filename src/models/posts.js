const mongoose = require("mongoose");
const { userDBConection } = require("../connections/mongodb");
//import { nanoid } from "nanoid";
const { nanoid } = require("nanoid");
//const { nanoid } = await import("nanoid");

const postSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  author: String,
  title: String,
  content: String,
  createdAt: Date,
  updatedAt: Date,
  tags: [String],
  status: String,
  replyTo: String,
  origin: String,
});

const postModel = userDBConection.model("posts", postSchema, "posts");

module.exports = postModel;
