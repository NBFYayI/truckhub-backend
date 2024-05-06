const { userService } = require("../services/database-services/user");

async function userInfo(username) {
  try {
    const r = await userService.getUser(username);
    //console.log(r);
    return r;
  } catch (error) {
    throw new Error("error in getUser" + error.message);
  }
}

async function login(username, password) {
  try {
    const r = await userService.getUser(username);
    //console.log(r);
    if (r.length == 0) {
      return 1;
      //throw new Error("username not found");
    }
    if (password != r[0].password) {
      return 2;
      //throw new Error("wrong password");
    }
    return 0;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function register(username, password) {
  try {
    const exist = await userService.checkUsernameExist(username);
    if (exist) {
      return 1;
    }
    const r = await userService.createUser(username, password);
    //console.log(r);
    return r;
  } catch (error) {
    throw new Error("error in createUser" + error.message);
  }
}

module.exports = { userInfo, login, register };
