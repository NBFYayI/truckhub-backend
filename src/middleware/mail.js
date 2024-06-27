const Mailjet = require("node-mailjet");
const { mailapiKey, mailapiSecret } = require("../configs/secretKey");

const mailCon = new Mailjet({
  apiKey: mailapiKey,
  apiSecret: mailapiSecret,
});

module.exports = { mailCon };
