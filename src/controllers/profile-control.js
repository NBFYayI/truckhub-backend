const { userService } = require("../services/database-services/user");

async function getProfile(username) {
  try {
    const r = await userService.getUserProfile(username);
    if (r.length == 0) {
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

module.exports = { getProfile, updateProfile };
