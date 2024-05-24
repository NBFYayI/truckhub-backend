const express = require("express");
const router = express.Router();
const {
  getPost,
  makeNewPost,
  updatePost,
  makeNewComment,
  updateComment,
  searchPost,
  deletePost,
  deleteComment,
} = require("../controllers/post-control");
const postVerify = require("../middleware/postAuth");

router.get("/", async (req, res) => {
  try {
    const id = req.query.id ? req.query.id : undefined;
    const author = req.query.author ? req.query.author : undefined;
    const title = req.query.title ? req.query.title : undefined;
    const content = req.query.content ? req.query.content : undefined;
    const tags = req.query.tags ? req.query.tags : undefined;
    const origin = req.query.origin ? req.query.origin : undefined;
    const doc = await getPost(id, author, title, content, tags, origin);
    res.status(200).send({
      success: true,
      message: "post loaded",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "cannot get post: " + error.message,
      });
    } else {
      console.error(error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
});

router.get("/search", async (req, res) => {
  try {
    //const id = req.query.id ? req.query.id : undefined;
    const author = req.query.author ? req.query.author : undefined;
    const title = req.query.title ? req.query.title : undefined;
    const content = req.query.content ? req.query.content : undefined;
    const tags = req.query.tags ? req.query.tags : undefined;
    const origin = req.query.origin ? req.query.origin : undefined;
    // const sortfield = req.query.sortBy ? req.query.sortBy : "updatedAt";
    const sortfield = req.query.sortBy ? req.query.sortBy : undefined;
    const order = req.query.order ? req.query.order : "desc";
    const skip = req.query.skip ? req.query.skip : 0;
    const limit = req.query.limit ? req.query.limit : 10;
    const isComment = req.query.comFlag;
    const latitude = req.query.latitude ? req.query.latitude : undefined;
    const longitude = req.query.longitude ? req.query.longitude : undefined;
    const doc = await searchPost(
      author,
      title,
      content,
      tags,
      origin,
      sortfield,
      order,
      skip,
      limit,
      isComment,
      latitude,
      longitude
    );
    res.status(200).send({
      success: true,
      message: "post loaded",
      data: doc.data,
      count: doc.count,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "cannot get post: " + error.message,
      });
    } else {
      console.error(error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
});

router.post("/new", postVerify, async (req, res) => {
  try {
    const author = req.body.author;
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const status = req.body.status;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const doc = await makeNewPost(
      author,
      title,
      content,
      tags,
      status,
      latitude,
      longitude
    );
    res.status(200).send({
      success: true,
      message: "successfully created post",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "cannot create post: " + error.message,
      });
    } else {
      console.error(error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
});

router.post("/update", postVerify, async (req, res) => {
  try {
    const id = req.body.id;
    const author = req.body.author;
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const status = req.body.status;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const doc = await updatePost(
      id,
      author,
      title,
      content,
      tags,
      status,
      latitude,
      longitude
    );
    res.status(200).send({
      success: true,
      message: "successfully updated post",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to update post: " + error.message,
      });
    } else {
      console.error(error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
});

router.post("/newcom", postVerify, async (req, res) => {
  try {
    const author = req.body.author;
    const content = req.body.content;
    const status = req.body.status;
    const replyTo = req.body.replyTo ? req.body.replyTo : "";
    const origin = req.body.origin;
    const doc = await makeNewComment(author, content, replyTo, origin, status);
    res.status(200).send({
      success: true,
      message: "successfully created comment",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "cannot create comment: " + error.message,
      });
    } else {
      console.error(error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
});

router.post("/updatecom", postVerify, async (req, res) => {
  try {
    const id = req.body.id;
    const author = req.body.author;
    const content = req.body.content;
    const status = req.body.status;
    const replyTo = req.body.replyTo;
    const doc = await updateComment(id, author, content, replyTo, status);
    res.status(200).send({
      success: true,
      message: "successfully updated comment",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to update post: " + error.message,
      });
    } else {
      console.error(error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
});

router.post("/deletecom", postVerify, async (req, res) => {
  try {
    const id = req.body.id;
    const author = req.body.author;
    const doc = await deleteComment(id, author);
    res.status(200).send({
      success: true,
      message: "successfully deleted comment",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to delete comment: " + error.message,
      });
    } else {
      console.error(error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
});

router.post("/deletepost", postVerify, async (req, res) => {
  try {
    const id = req.body.id;
    const author = req.body.author;
    const doc = await deletePost(id, author);
    res.status(200).send({
      success: true,
      message: "successfully deleted comment",
      data: doc,
    });
  } catch (error) {
    if (error.code) {
      res.status(error.code).send({
        success: false,
        message: "failed to delete post: " + error.message,
      });
    } else {
      console.error(error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
});

module.exports = router;
