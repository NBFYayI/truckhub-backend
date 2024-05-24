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
  status: { type: String, default: "public" },
  replyTo: String,
  origin: String,
  isComment: { type: Boolean, default: false },
  latitude: Number,
  longitude: Number,
});

postSchema.index({ title: "text", content: "text" });

const postModel = userDBConection.model("posts", postSchema, "posts");
postModel.createIndexes();

module.exports = postModel;
