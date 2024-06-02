const { userService } = require("../services/database-services/user");
const { encryptService } = require("../services/database-services/encrypt");

async function userInfo(username) {
  try {
    const r = await userService.getUser(username);
    //console.log(r);
    return r;
  } catch (error) {
    throw new Error("error in getUser: " + error.message);
  }
}

async function login(username, password) {
  try {
    const r = await userService.getUser(username);
    //console.log(r);
    if (r.length == 0) {
      //return 1;
      const e = new Error("username not found");
      e.code = "404";
      throw e;
      //throw new Error("username not found");
    }
    if (!encryptService.verifyPassword(password, r[0].password)) {
      const e = new Error("wrong password");
      e.code = "400";
      throw e;
      //throw new Error("wrong password");
    }
    return 0;
  } catch (error) {
    throw error;
    //throw new Error(error.message);
  }
}

async function register(username, password) {
  try {
    const exist = await userService.checkUsernameExist(username);
    if (exist) {
      const e = new Error("username already exist");
      e.code = "400";
      throw e;
    }
    const encryptedpassword = encryptService.encryptPassword(password);
    const r = await userService.createUser(username, encryptedpassword);
    const filter = { username: username };
    const update = {
      firstName: "",
      lastName: "",
      occupation: "",
      email: "",
    };
    const pf = await userService.updateUserProfile(filter, update);
    //console.log(r);
    return pf;
  } catch (error) {
    throw error;
    //throw new Error("error in createUser: " + error.message);
  }
}

module.exports = { userInfo, login, register };
