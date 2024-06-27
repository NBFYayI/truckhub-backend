const userModel = require("../../models/user");

class UserService {
  async getUser(username) {
    try {
      const res = await userModel.findOne({
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

  async createUser(doc) {
    try {
      await userModel.create(doc);
    } catch (error) {
      throw new Error("error in createUser: " + error.message);
    }
  }

  async getUserProfile(username) {
    try {
      const res = await userModel
        .findOne({
          username: username,
        })
        .select({ password: 0, email: 0, otp: 0, verified: 0 });
      return res;
    } catch (error) {
      throw new Error("error in getUserProfile: " + error.message);
    }
  }

  async updateUserProfile(filter, update) {
    try {
      const doc = await userModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      return doc;
    } catch (error) {
      throw new Error("error in updateUserProfile: " + error.message);
    }
  }

  async updateUser(filter, update) {
    try {
      const doc = await userModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      return doc;
    } catch (error) {
      throw new Error("error in updateUserProfile: " + error.message);
    }
  }
}

const userService = new UserService();
module.exports = { userService };
