const { userService } = require("../services/database-services/user");
const { encryptService } = require("../services/database-services/encrypt");

const { mailService } = require("../services/api-services/mail");

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
    if (!r) {
      //return 1;
      const e = new Error("username not found");
      e.code = "404";
      throw e;
      //throw new Error("username not found");
    }
    if (!encryptService.verifyPassword(password, r.password)) {
      const e = new Error("wrong password");
      e.code = "400";
      throw e;
      //throw new Error("wrong password");
    }
    if (r.verified === false) {
      return 1;
    }
    return 0;
  } catch (error) {
    throw error;
    //throw new Error(error.message);
  }
}

async function register(
  username,
  password,
  email,
  nickname,
  firstname,
  lastname,
  occupation
) {
  try {
    const exist = await userService.checkUsernameExist(username);
    if (exist) {
      const e = new Error("username already exist");
      e.code = "400";
      throw e;
    }
    const encryptedpassword = encryptService.encryptPassword(password);

    const newUser = {
      username: username,
      password: encryptedpassword,
      email: email,
      nickname: nickname,
      firstName: firstname,
      lastName: lastname,
      occupation: occupation,
    };
    const r = await userService.createUser(newUser);

    //console.log(r);
    return r;
  } catch (error) {
    throw error;
    //throw new Error("error in createUser: " + error.message);
  }
}

async function changePassword(username, oldPass, newPass) {
  try {
    const usr = await userService.getUser(username);
    //console.log(r);
    if (!usr) {
      //return 1;
      const e = new Error("username not found");
      e.code = "404";
      throw e;
      //throw new Error("username not found");
    }
    if (!encryptService.verifyPassword(oldPass, usr.password)) {
      const e = new Error("wrong password");
      e.code = "400";
      throw e;
      //throw new Error("wrong password");
    }
    const encryptedpassword = encryptService.encryptPassword(newPass);
    const filter = { username: username };
    const update = {
      password: encryptedpassword,
    };
    const r = await userService.updateUser(filter, update);

    //console.log(r);
    return r.username;
  } catch (error) {
    throw error;
    //throw new Error("error in createUser: " + error.message);
  }
}
async function changeEmail(username, email) {
  try {
    const usr = await userService.getUserEmail(username);
    //console.log(r);
    if (!usr) {
      //return 1;
      const e = new Error("username not found");
      e.code = "404";
      throw e;
      //throw new Error("username not found");
    }
    if (usr.email === email) {
      const e = new Error("email cannot be the same");
      e.code = "400";
      throw e;
    }

    const filter = { username: username };
    const update = {
      email: email,
      verified: false,
    };
    const r = await userService.updateUser(filter, update);

    //console.log(r);
    return r.username;
  } catch (error) {
    throw error;
    //throw new Error("error in createUser: " + error.message);
  }
}

async function getProfile(username) {
  try {
    const r = await userService.getUserProfile(username);
    if (!r) {
      const e = new Error("username not found");
      e.code = "404";
      throw e;
    }
    return r;
  } catch (error) {
    throw error;
    //throw new Error("error in getProfile: " + error.message);
  }
}

async function getEmail(username) {
  try {
    const r = await userService.getUserEmail(username);
    if (!r) {
      const e = new Error("username not found");
      e.code = "404";
      throw e;
    }
    return r;
  } catch (error) {
    throw error;
    //throw new Error("error in getProfile: " + error.message);
  }
}

async function updateProfile(
  username,
  firstName,
  lastName,
  occupation,
  nickname
) {
  try {
    const filter = { username: username };
    const update = {
      firstName: firstName,
      lastName: lastName,
      occupation: occupation,
      nickname: nickname,
    };
    const r = await userService.updateUserProfile(filter, update);
    return r;
  } catch (error) {
    throw new Error("error in updateProfile: " + error.message);
  }
}

async function sendEmail(username) {
  try {
    const r = await userService.getUser(username);
    //console.log(r);
    if (!r) {
      //return 1;
      const e = new Error("username not found");
      e.code = "404";
      throw e;
      //throw new Error("username not found");
    }
    if (r.verified === true) {
      const e = new Error("email already verified");
      e.code = 400;
      throw e;
    }
    const email = r.email;
    const code = Math.floor(100000 + Math.random() * 900000);
    const date = new Date();
    const otp = { code: code, timestamp: date };
    const filter = { username: username };

    const update = { otp: otp };
    const up = await userService.updateUser(filter, update);
    mailService.sendEmail(username, email, code);
    return 0;
  } catch (error) {
    throw error;
    //throw new Error(error.message);
  }
}
async function emailVerify(username, code) {
  try {
    const r = await userService.getUser(username);
    //console.log(r);
    if (!r) {
      //return 1;
      const e = new Error("username not found");
      e.code = 404;
      throw e;
      //throw new Error("username not found");
    }
    if (r.verified === true) {
      const e = new Error("email already verified");
      e.code = 400;
      throw e;
    }
    if (r.otp.code !== code) {
      const e = new Error("incorrect otp");
      e.code = 401;
      throw e;
    }
    const rdate = r.otp.timestamp;
    const date = new Date();
    if (date.getTime() - rdate.getTime() >= 10 * 60 * 1000) {
      const e = new Error("otp expired");
      e.code = 403;
      throw e;
    }
    const filter = { username: username };
    const update = { verified: true };
    const up = await userService.updateUser(filter, update);
    return 0;
  } catch (error) {
    throw error;
    //throw new Error(error.message);
  }
}

module.exports = {
  userInfo,
  login,
  register,
  changePassword,
  changeEmail,
  getProfile,
  getEmail,
  updateProfile,
  sendEmail,
  emailVerify,
};
