const { search } = require("../routes/health");
const { postService } = require("../services/database-services/post");
const { nanoid } = require("nanoid");
const { tagService } = require("../services/database-services/tag");

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
  limit,
  cFlag,
  latitude,
  longitude,
  dist
) {
  try {
    const filter = {};

    //if (id) filter._id = id;
    if (author) filter.author = author;
    if (title) filter.title = new RegExp("^" + title, "i");
    if (content) filter.content = new RegExp(content, "i");
    if (tags && tags.length) filter.tags = { $in: tags };
    if (origin) filter.origin = origin;
    if (cFlag !== undefined) filter.isComment = cFlag;
    if (latitude && longitude && dist) {
      const latChange = parseFloat(dist) / 69;
      const longChange =
        parseFloat(dist) /
        (69 * Math.cos((parseFloat(latitude) * Math.PI) / 180));
      filter.latitude = {
        $gte: parseFloat(latitude) - latChange,
        $lte: parseFloat(latitude) + latChange,
      };
      filter.longitude = {
        $gte: parseFloat(longitude) - longChange,
        $lte: parseFloat(longitude) + longChange,
      };
    }
    const sortCriteria = { isComment: "asc" };
    // sortCriteria[sortfield] = order;
    if (!sortfield) {
      sortCriteria["updatedAt"] = order;
    }
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
    const robj = {};
    robj.data = r;
    return robj;
  } catch (error) {
    throw error;
  }
}

async function makeNewPost(
  author,
  title,
  content,
  tags,
  status,
  latitude,
  longitude
) {
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
    if (latitude !== undefined) {
      newPost.latitude = latitude;
    }
    if (longitude !== undefined) {
      newPost.longitude = longitude;
    }

    const r = await postService.createPost(newPost);
    if (tags && tags.length) {
      await tagService.addTags(tags);
    }

    return r;
  } catch (error) {
    throw error;
  }
}

async function updatePost(
  id,
  author,
  title,
  content,
  tags,
  status,
  latitude,
  longitude
) {
  try {
    const filter = { _id: id, author: author };
    const currentDate = new Date();
    const update = {
      title: title ? title : undefined,
      content: content ? content : undefined,
      tags: tags ? tags : undefined,
      updatedAt: currentDate,
    };
    if (status) update.status = status;
    if (latitude !== undefined) {
      update.latitude = latitude;
    }
    if (longitude !== undefined) {
      update.longitude = longitude;
    }

    const r = await postService.updatePost(filter, update);
    if (!r) {
      const e = new Error("post not found");
      e.code = "404";
      throw e;
    }
    if (r.tags && r.tags.length) await tagService.subTags(r.tags);
    if (tags && tags.length) await tagService.addTags(tags);
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

async function updateComment(id, author, content, replyTo, status) {
  try {
    const filter = { _id: id, author: author };
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

async function deleteComment(id, author) {
  try {
    const post = await postService.getById(id);
    if (!post || post.author !== author) {
      const e = new Error("comment not found");
      e.code = "404";
      throw e;
    }

    const r = await postService.deleteCom(id);

    return r;
  } catch (error) {
    throw error;
  }
}

async function deletePost(id, author) {
  try {
    const post = await postService.getById(id);
    if (!post || post.author !== author) {
      const e = new Error("post not found");
      e.code = "404";
      throw e;
    }
    if (post.tags && post.tags.length) await tagService.subTags(post.tags);
    const filter = { origin: id };
    const r = await postService.deletePost(filter);

    return r;
  } catch (error) {
    throw error;
  }
}

async function getTag(tag, limit) {
  try {
    const filter = {};

    if (tag && tag.length) filter.tagname = { $regex: tag, $options: "i" };
    const sortCriteria = { count: "desc" };

    const options = {
      sort: sortCriteria,
      limit: limit,
    };
    const r = await tagService.getTags(filter, options);
    if (r.length == 0) {
      const e = new Error("no tag found");
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
  deleteComment,
  deletePost,
  getTag,
};
