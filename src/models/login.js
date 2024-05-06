const mongoose = require("mongoose");
const { userDBConection } = require("../connections/mongodb");

const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const loginModel = userDBConection.model("login", loginSchema, "login");
// const loginModel = mongoose.model("login", loginSchema, "login");

module.exports = loginModel;
