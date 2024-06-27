const mongoose = require("mongoose");
const { userDBConection } = require("../connections/mongodb");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // This field is required
    unique: true, // This field must be unique
  },
  password: String,
  email: {
    type: String,
    required: true, // This field is required
    unique: true, // This field must be unique
  },
  nickname: String,
  firstName: String,
  lastName: String,
  occupation: String,
  verified: { type: Boolean, default: false },
  otp: {
    code: { type: String },
    timestamp: { type: Date },
  },
});

const userModel = userDBConection.model("login", loginSchema, "login");
// const loginModel = mongoose.model("login", loginSchema, "login");

module.exports = userModel;
