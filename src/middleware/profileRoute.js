const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../configs/secretKey");

const profileVerify = (req, res, next) => {
  const token = req.headers.jwt;
  console.log(token + "profileRoute-6");
  if (!token) {
    return res.status(401).send({ message: "Unauthorized Profile" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (req.body.username !== decoded.username) {
      throw new Error();
    }
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = profileVerify;
