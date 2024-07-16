const { messageService } = require("../services/database-services/message");
const { userService } = require("../services/database-services/user");

async function sendMessage(src, dest, content) {
  try {
    const f = await userService.getUser(src);
    if (!f) {
      const e = new Error("username not found");
      e.code = 404;
      throw e;
    }
    const t = await userService.getUser(dest);
    if (!t) {
      const e = new Error("username not found");
      e.code = 404;
      throw e;
    }
    const date = new Date();

    const message = {
      from: src,
      to: dest,
      content: content,
      timestamp: date,
    };

    const dm = await messageService.createMessage(message);

    return dm;
  } catch (error) {
    throw error;
  }
}

async function getAllMessages(user1) {
  try {
    const filter = {
      $or: [{ from: user1 }, { to: user1 }],
    };
    const options = {
      sort: { timestamp: "desc" },
    };

    const docs = await messageService.searchMessage(filter, options);
    if (docs.length === 0) {
      const e = new Error("No messages found for user:" + user1);
      e.code = 404;
      throw e;
    }

    return docs;
  } catch (error) {
    throw error;
  }
}

async function getMessageBetween(user1, user2, skip, limit) {
  try {
    const filter = {
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    };
    const options = {
      sort: { timestamp: "desc" },
      skip: skip,
      limit: limit,
    };

    const docs = await messageService.searchMessage(filter, options);
    if (docs.length === 0) {
      const e = new Error(
        "No messages found between users:" + user1 + " and " + user2
      );
      e.code = 404;
      throw e;
    }

    return docs;
  } catch (error) {
    throw error;
  }
}

async function getConvs(user1) {
  try {
    const usrlist = await messageService.findConvUsers(user1);
    return usrlist;
  } catch (error) {
    throw error;
  }
}

async function setRead(msgids) {
  try {
    const readmsgs = await messageService.readMessages(msgids);
    return readmsgs.modifiedCount;
  } catch (error) {
    throw error;
  }
}

async function userSearch(keyword) {
  try {
    console.log(keyword + " fuckyou");
    const filter = {};
    const options = {};
    if (keyword.trim()) {
      filter.username = new RegExp("^" + keyword.trim(), "i");
    } else {
      throw new Error("keyword cannot be empty");
    }

    const users = await userService.searchUser(filter, options);
    return users;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  sendMessage,
  getAllMessages,
  getMessageBetween,
  getConvs,
  setRead,
  userSearch,
};
