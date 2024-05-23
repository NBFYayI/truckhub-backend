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

  async countPost(filter) {
    try {
      const res = await postModel.countDocuments(filter);
      return res;
    } catch (error) {
      throw new Error("error in service: countPost" + error.message);
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

  async deleteCom(id) {
    try {
      const doc = await postModel.findByIdAndDelete(id);
      return doc;
    } catch (error) {
      throw new Error("error in service: deleteCom: " + error.message);
    }
  }

  async deletePost(filter) {
    try {
      const doc = await postModel.deleteMany(filter);
      return doc;
    } catch (error) {
      throw new Error("error in service: deletePost: " + error.message);
    }
  }

  async getById(id) {
    try {
      const doc = await postModel.findById(id);
      return doc;
    } catch (error) {
      throw new Error("error in service: getPostById: " + error.message);
    }
  }
}
const postService = new PostService();
module.exports = { postService };
