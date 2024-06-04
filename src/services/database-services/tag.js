const tagModel = require("../../models/tags");

class TagService {
  async getTags(filter, options) {
    try {
      const res = await tagModel.find(filter, options);
      return res;
    } catch (error) {
      throw new Error("error in service: getTags" + error.message);
    }
  }

  async createTag(tag) {
    try {
      const r = await tagModel.create(tag);
    } catch (error) {
      throw new Error("error in service: createTag: " + error.message);
    }
  }

  async updateTag(filter, update) {
    try {
      const doc = await tagModel.updateOne(filter, update);
    } catch (error) {
      throw new Error("error in service: createTag: " + error.message);
    }
  }

  async addTags(tagNames) {
    try {
      // Create bulk operations for existing tags
      const bulkOps = tagNames.map((tagName) => ({
        updateOne: {
          filter: { tagname: tagName },
          update: { $inc: { count: 1 } },
          upsert: true,
        },
      }));

      // Perform the bulk write operation
      await tagModel.bulkWrite(bulkOps);

      console.log("Tags updated");
    } catch (error) {
      console.error("Error updating tags:", error);
      throw error;
    }
  }

  async subTags(tagNames) {
    try {
      // Create bulk operations for existing tags
      const bulkOps = tagNames.map((tagName) => ({
        updateOne: {
          filter: { tagname: tagName },
          update: { $inc: { count: -1 } },
        },
      }));

      // Perform the bulk write operation
      await tagModel.bulkWrite(bulkOps);

      console.log("Tags updated");
    } catch (error) {
      console.error("Error updating tags:", error);
      throw error;
    }
  }
}
const tagService = new TagService();
module.exports = { tagService };
