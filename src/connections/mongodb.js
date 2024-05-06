const mongoose = require("mongoose");

function connectToUserDB() {
  const connection = mongoose.createConnection(
    "mongodb+srv://NBFYayI:Kobetao24@cluster0.dothexs.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0"
  );
  return connection;
}

const userDBConection = connectToUserDB();
module.exports = { userDBConection };
