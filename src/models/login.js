const mongoose = require("mongoose");
const { userDBConection } = require("../connections/mongodb");

const loginSchema = mongoose.Schema({
  username: String,
  password: String,
});

const loginModel = userDBConection.model("login", loginSchema, "login");

module.exports = loginModel;
