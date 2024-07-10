const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../configs/secretKey");

function socketVerify(username, token) {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (username !== decoded.username) {
      throw new Error("invalid token");
    }
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

module.exports = socketVerify;
