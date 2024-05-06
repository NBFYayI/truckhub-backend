const loginModel = require("../../models/login");

class UserService {
  async getUser(username) {
    try {
      const res = await loginModel.find({
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

      return res;
    } catch (error) {
      throw new Error("error in getUser" + error.message);
    }
  }
}

const userService = new UserService();
module.exports = { userService };
