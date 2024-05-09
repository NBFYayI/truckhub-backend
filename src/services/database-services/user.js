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
      console.log(res);
      if (res.length == 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      throw new Error("error in checkUsername: " + error.message);
    }
  }

  async createUser(username, password) {
    try {
      const doc = {
        username: username,
        password: password,
        //_id: new ObjectID(),
      };
      await userModel.create(doc);
    } catch (error) {
      throw new Error("error in createUser: " + error.message);
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

  async updateUserProfile(filter, update) {
    try {
      const doc = await profileModel.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      });
      return doc;
    } catch (error) {
      throw new Error("error in updateUserProfile: " + error.message);
    }
  }
}

const userService = new UserService();
module.exports = { userService };
