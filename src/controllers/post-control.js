const { postService } = require("../services/database-services/post");

async function getPosts() {}

async function updateProfile(username, firstName, lastName, occupation, email) {
  try {
    const filter = { username: username };
    const update = {
      firstName: firstName,
      lastName: lastName,
      occupation: occupation,
      email: email,
    };
    const r = await userService.updateUserProfile(filter, update);
    return r;
  } catch (error) {
    throw new Error("error in updateProfile: " + error.message);
  }
}
