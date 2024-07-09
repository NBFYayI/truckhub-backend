const mongoose = require("mongoose");
const { userDBConection } = require("../connections/mongodb");

const messageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true, // This field is required
  },
  to: {
    type: String,
    required: true, // This field is required
  },
  content: {
    type: String,
    required: true, // This field is required
  },
  read: {
    type: Boolean,
    required: true, // This field is required
    default: false,
  },
  timestamp: {
    type: Date,
    required: true, // This field is required
    default: Date.now(),
  },
});

const messageModel = userDBConection.model("message", messageSchema, "message");
module.exports = messageModel;
