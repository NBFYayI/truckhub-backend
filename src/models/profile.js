const mongoose = require("mongoose");
const { userDBConection } = require("../connections/mongodb");

const profileSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  occupation: String,
  email: String,
});

const profileModel = userDBConection.model("profile", profileSchema, "profile");

module.exports = profileModel;
