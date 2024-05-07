const userModel = require("../../models/login");
const profileModel = require("../../models/profile");

class UserService {
  async getUser(username) {
    try {
      const res = await userModel.find({
        username: username,
      });
      return res;
    } catch (error) {
      throw new Error("error in getUser" + error.message);
    }
  }

  async checkUsernameExist(username) {
    try {
      const res = await userModel.find({
        username: username,
      });
      if (res.length == 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      throw new Error("error in checkUsername" + error.message);
    }
  }

  async createUser(username, password) {
    try {
      const doc = {
        username: username,
        password: password,
        //_id: new ObjectID(),
      };
      userModel.create(doc);
    } catch (error) {
      throw new Error("error in checkUsername: " + error.message);
    }
  }

  async getUserProfile(username) {
    try {
      const res = await profileModel.find({
        username: username,
      });
      return res;
    } catch (error) {
      throw new Error("error in getUserProfile: " + error.message);
    }
  }

  async updateUserProfile(
    username,
    firstName = "",
    lastName = "",
    occupation = "",
    email = ""
  ) {
    try {
      const filter = { username: username };
      const update = {
        firstName: firstName,
        lastName: lastName,
        occupation: occupation,
        email: email,
      };
      const doc = await profileModel.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      });
      return doc;
    } catch (error) {
      throw new Error("error in checkUsername: " + error.message);
    }
  }
}

const userService = new UserService();
module.exports = { userService };
