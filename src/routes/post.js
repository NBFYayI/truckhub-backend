const express = require("express");
const router = express.Router();
const {
  getPost,
  makeNewPost,
  updatePost,
  makeNewComment,
  updateComment,
  searchPost,
} = require("../controllers/post-control");

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
    const sortfield = req.query.sortBy ? req.query.sortBy : "updatedAt";
    const order = req.query.order ? req.query.order : "desc";
    const skip = req.query.skip ? req.query.skip : 0;
    const limit = req.query.limit ? req.query.limit : 10;
    const doc = await searchPost(
      author,
      title,
      content,
      tags,
      origin,
      sortfield,
      order,
      skip,
      limit
    );
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

router.post("/new", async (req, res) => {
  try {
    const author = req.body.author;
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const status = req.body.status;

    const doc = await makeNewPost(author, title, content, tags, status);
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

router.post("/update", async (req, res) => {
  try {
    const id = req.body.id;
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const status = req.body.status;
    const doc = await updatePost(id, title, content, tags, status);
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

router.post("/newcom", async (req, res) => {
  try {
    const author = req.body.author;
    const content = req.body.content;
    const status = req.body.status;
    const replyTo = req.body.replyTo ? req.body.replyTo : "";
    const origin = req.body.origin;
    const doc = await makeNewComment(author, content, replyTo, origin, status);
    res.status(200).send({
      success: true,
      message: "successfully created post",
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

router.post("/updatecom", async (req, res) => {
  try {
    const id = req.body.id;
    const content = req.body.content;
    const status = req.body.status;
    const replyTo = req.body.replyTo;
    const doc = await updateComment(id, content, replyTo, status);
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

module.exports = router;
