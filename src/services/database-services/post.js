const postModel = require("../../models/posts.js");

class PostService {
  async getPost(filter) {
    try {
      const res = await postModel.find(filter);
      return res;
    } catch (error) {
      throw new Error("error in service: getPost" + error.message);
    }
  }

  async searchPost(filter, option) {
    try {
      const res = await postModel.find(filter, null, option);
      return res;
    } catch (error) {
      throw new Error("error in service: searchPost" + error.message);
    }
  }

  async createPost(post) {
    try {
      const r = await postModel.create(post);
    } catch (error) {
      throw new Error("error in service: createPost: " + error.message);
    }
  }

  async updatePost(filter, update) {
    try {
      const doc = await postModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      return doc;
    } catch (error) {
      throw new Error("error in service: updatePost: " + error.message);
    }
  }
}
const postService = new PostService();
module.exports = { postService };
