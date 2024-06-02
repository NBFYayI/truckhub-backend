const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../configs/secretKey");

const postVerify = (req, res, next) => {
  const token = req.headers.jwt;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (req.body.author !== decoded.username) {
      throw new Error();
    }
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = postVerify;
