const CryptoJS = require("crypto-js");
const { SECRET_KEY } = require("../../configs/secretKey");

class EncryptService {
  encryptPassword(password) {
    const ciphertext = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    return ciphertext;
  }

  verifyPassword(password, encryptedPassword) {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    console.log(password + "========");
    console.log("========" + decryptedPassword);
    return password === decryptedPassword;
  }
}

const encryptService = new EncryptService();
module.exports = { encryptService };
