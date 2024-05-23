const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/secretKey");
const { getPost } = require("./controllers/post-control");

const postVerify = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (req.body.author !== decoded.username) {
      throw new Error();
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorVerify = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (req.body.author !== decoded.username) {
      throw new Error();
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = postVerify;
