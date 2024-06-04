const mongoose = require("mongoose");
const { userDBConection } = require("../connections/mongodb");

const tagSchema = new mongoose.Schema({
  tagname: { type: String, unique: true, required: true, dropDups: true },
  count: { type: Number, default: 1 },
});

const tagModel = userDBConection.model("tags", tagSchema, "tags");

module.exports = tagModel;
