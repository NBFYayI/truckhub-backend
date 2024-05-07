const { userService } = require("../services/database-services/user");

async function getProfile(username) {
  try {
    const r = await userService.getUserProfile(username);
    return r;
  } catch (error) {
    throw new Error("error in getProfile: " + error.message);
  }
}

async function updateProfile(username, firstName, lastName, occupation, email) {
  try {
    const r = await userService.updateUserProfile(
      username,
      firstName,
      lastName,
      occupation,
      email
    );
    return r;
  } catch (error) {
    throw new Error("error in updateProfile: " + error.message);
  }
}

module.exports = { getProfile, updateProfile };
