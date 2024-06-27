const { userService } = require("../services/database-services/user");
const { encryptService } = require("../services/database-services/encrypt");
const Mailjet = require("node-mailjet");
const { mailCon } = require("../middleware/mail");

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
    if (!encryptService.verifyPassword(password, r[0].password)) {
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
      firstname: firstname,
      lastname: lastname,
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

async function updateProfile(
  username,
  firstName,
  nickname,
  lastName,
  occupation
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
    const request = mailCon.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "truckhub1@gmail.com",
            Name: "Truckhub Official",
          },
          To: [
            {
              Email: "nbfyayi@gmail.com",
              Name: "You",
            },
          ],
          Subject: "dog",
          TextPart:
            "hey dog your fking code is " +
            code +
            ". The code will expire in 10 minutes.",
        },
      ],
    });
    request
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err.statusCode);
        throw err;
      });
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
  getProfile,
  updateProfile,
  sendEmail,
  emailVerify,
};
