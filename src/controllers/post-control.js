const { postService } = require("../services/database-services/post");
const { nanoid } = require("nanoid");

async function getPost() {
  try {
    const r = await postService.getPost({});
    return r;
  } catch (error) {
    throw new Error("error in getPost: " + error.message);
  }
}

async function makeNewPost(author, title, content, tags, status) {
  try {
    const currentDate = new Date();
    const newid = nanoid();
    const newPost = {
      _id: newid,
      author: author,
      title: title,
      content: content,
      createdAt: currentDate,
      updatedAt: currentDate,
      tags: tags,
      status: status,
      replyTo: "",
      origin: newid,
    };

    const r = await postService.createPost(newPost);
    return r;
  } catch (error) {
    throw new Error("error in makeNewPost: " + error.message);
  }
}

async function updatePost(id, author, title, content, tags, status) {
  try {
    const filter = { _id: id };
    const currentDate = new Date();
    const update = {
      author: author ? author : undefined,
      title: title ? title : undefined,
      content: content ? content : undefined,
      tags: tags ? tags : undefined,
      status: status ? status : undefined,
      updatedAt: currentDate,
    };

    const r = await postService.updatePost(filter, update);
    if (!r) {
      const e = new Error("post not found");
      e.code = "404";
      throw e;
    }
    return r;
  } catch (error) {
    throw error;
  }
}

module.exports = { getPost, makeNewPost, updatePost };
