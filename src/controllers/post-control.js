const { search } = require("../routes/health");
const { postService } = require("../services/database-services/post");
const { nanoid } = require("nanoid");

async function getPost(id, author, title, content, tags, origin) {
  try {
    const filter = {};

    if (id) filter._id = id;
    if (author) filter.author = author;
    if (title) filter.title = title;
    if (content) filter.content = { $regex: content, $options: "i" };
    if (tags && tags.length) filter.tags = { $in: tags };
    if (origin) filter.origin = origin;

    const r = await postService.getPost(filter);
    if (r.length == 0) {
      const e = new Error("no post found");
      e.code = "404";
      throw e;
    }
    return r;
  } catch (error) {
    throw error;
  }
}

async function searchPost(
  author,
  title,
  content,
  tags,
  origin,
  sortfield,
  order,
  skip,
  limit
) {
  try {
    const filter = {};

    //if (id) filter._id = id;
    if (author) filter.author = author;
    if (title) filter.title = title;
    if (content) filter.content = { $regex: content, $options: "i" };
    if (tags && tags.length) filter.tags = { $in: tags };
    if (origin) filter.origin = origin;

    const sortCriteria = { isComment: "asc" };
    sortCriteria[sortfield] = order;
    const options = {
      sort: sortCriteria,
      skip: skip,
      limit: limit,
    };

    const r = await postService.searchPost(filter, options);
    if (r.length == 0) {
      const e = new Error("no post found");
      e.code = "404";
      throw e;
    }
    return r;
  } catch (error) {
    throw error;
  }
}

async function makeNewPost(author, title, content, tags, status) {
  try {
    if (!author || !title || !content) {
      const e = new Error("Post must contain author, title and content");
      e.code = "400";
      throw e;
    }
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
      replyTo: "",
      origin: newid,
    };
    if (status) {
      newPost.status = status;
    }

    const r = await postService.createPost(newPost);
    return r;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, title, content, tags, status) {
  try {
    const filter = { _id: id };
    const currentDate = new Date();
    const update = {
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

async function makeNewComment(author, content, replyTo, origin, status) {
  try {
    if (!author || !origin || !content) {
      const e = new Error("Comment must contain author, content and origin");
      e.code = "400";
      throw e;
    }
    const currentDate = new Date();
    const newid = nanoid();
    const newPost = {
      _id: newid,
      author: author,
      content: content,
      createdAt: currentDate,
      updatedAt: currentDate,
      replyTo: replyTo,
      origin: origin,
      isComment: true,
    };
    if (status) {
      newPost.status = status;
    }

    const r = await postService.createPost(newPost);
    return r;
  } catch (error) {
    throw error;
  }
}

async function updateComment(id, content, replyTo, status) {
  try {
    const filter = { _id: id };
    const currentDate = new Date();
    const update = {
      content: content ? content : undefined,
      replyTo: replyTo ? replyTo : undefined,
      status: status ? status : undefined,
      updatedAt: currentDate,
    };

    const r = await postService.updatePost(filter, update);
    if (!r) {
      const e = new Error("comment not found");
      e.code = "404";
      throw e;
    }
    return r;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPost,
  makeNewPost,
  updatePost,
  makeNewComment,
  updateComment,
  searchPost,
};
