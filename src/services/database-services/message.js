const messageModel = require("../../models/messages");
class MessageService {
  async createMessage(doc) {
    try {
      await messageModel.create(doc);
    } catch (error) {
      throw new Error("error in createMessage: " + error.message);
    }
  }

  async searchMessage(filter, option) {
    try {
      const res = await messageModel.find(filter, null, option);
      return res;
    } catch (error) {
      throw new Error("error in service: searchPost; " + error.message);
    }
  }

  async findConvUsers(user1) {
    try {
      const conversations = await messageModel.aggregate([
        {
          $match: {
            $or: [{ from: user1 }, { to: user1 }],
          },
        },
        {
          $project: {
            conversationPartner: {
              $cond: {
                if: { $eq: ["$from", user1] },
                then: "$to",
                else: "$from",
              },
            },
          },
        },
        {
          $group: {
            _id: "$conversationPartner",
          },
        },
        {
          $project: {
            _id: 0,
            username: "$_id",
          },
        },
      ]);

      if (conversations.length === 0) {
        const e = new Error("No conversations found for user:" + user1);
        e.code = 404;
        throw e;
      }

      return conversations.map((convo) => convo.username);
    } catch (error) {
      throw new Error("error in service: findConvUsers; " + error.message);
    }
  }
}

const messageService = new MessageService();
module.exports = { messageService };
