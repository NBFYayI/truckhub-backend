const { userService } = require("../services/database-services/user");

async function userInfo(username) {
  return userService.getUser(username);
}

module.exports = {
  userInfo,
};
