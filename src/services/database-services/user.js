const userModel = require("../../models/login");

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
      if (!res) {
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
        _id: new ObjectID(),
      };
      userModel.create(doc, (err, user) => {
        if (err) {
          console.error(err);
        } else {
          console.log("User created:", user);
        }
      });
    } catch (error) {
      throw new Error("error in checkUsername" + error.message);
    }
  }
}

const userService = new UserService();
module.exports = { userService };
