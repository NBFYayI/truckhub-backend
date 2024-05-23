const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../configs/secretKey");

const postVerify = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("111111111111111111");
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
