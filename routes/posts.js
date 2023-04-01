const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// db models
const db = require("../models");

// get all posts
router.get("/all", verifyToken, async (req, res, next) => {
  try {
    const posts = await db.Post.findAll();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// get user posts
router.get("/", verifyToken, async (req, res, next) => {
  // verifyToken adds user object containing id and email to request body
  const { email, id } = req.user;
  try {
    const posts = await db.Post.findAll({ where: { userId: id } });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// create a new post
router.post("/", verifyToken, async (req, res, next) => {
  // verifyToken adds user object containing id and email to request body
  const { email, id } = req.user;
  const { title, body } = req.body;
  try {
    const post = await db.Post.create({
      title,
      body,
      UserId: id,
    });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
