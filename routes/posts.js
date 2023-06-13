const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// db models
const db = require("../models");

// get all posts
router.get("/all", verifyToken, async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      include: [
        {
          model: db.User,
          attributes: { exclude: ["password", "createdAt", "updatedAt"] }
        },
        {
          model: db.Likes,
          attributes: ["id"],
          include: [
            {
              model: db.User,
              attributes: ["username", "id", "avatar"]
            }
          ]
        }
      ]
    });
    res.status(200).json(posts);
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
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// create a new post
router.post("/", verifyToken, async (req, res, next) => {
  // verifyToken adds user object containing id and email to request body
  const { email, id } = req.user;
  const { title, body, postImg } = req.body;
  try {
    const post = await db.Post.create({
      title,
      body,
      postImg,
      userId: id,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
// delete a post
router.delete("/:id", verifyToken, async (req, res, next) => {
  // verifyToken adds user object containing id and email to request body
  const { email, id } = req.user;
  const { id: postId } = req.params;
  try {
    const post = await db.Post.destroy({ where: { id: postId } });
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
})
// like/unlike a post
router.put("/like", verifyToken, async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: postId } = req.query;

  try {
    // Find the user and post based on their IDs
    const user = await db.User.findByPk(userId);
    const post = await db.Post.findByPk(postId);

    // Check if the user and post exist
    if (!user || !post) {
      return res.status(404).send("User or post not found");
    }
    // Check if the user has already liked the post
    const isLiked = await db.Likes.findOne({ where: { UserId: userId, PostId: postId } });
    if (isLiked) {
      await db.Likes.destroy({ where: { UserId: userId, PostId: postId } });
      return res.status(200).send("Post unliked successfully");
    }

    // Create a like entry for the user and post
    await db.Likes.create({
      UserId: userId,
      PostId: postId
    });

    res.status(200).send("Post liked successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// add a comment
router.post("/comment", verifyToken, async (req, res, next) => {
  const { userId: userId } = req.user;
  const { postId: postId } = req.params;
  const { parentId: parentId } = req.params;
  const { body } = req.body;
  console.log(userId, postId, parentId, body);
  // if (postId) {
  //   const user = await db.User.findByPk(userId);
  //   const post = await db.Post.findByPk(postId);
  //   if (!user || !post) {
  //     return res.status(404).send("User or post not found");
  //   }
  //   await db.Comments.create({
  //     PostId: postId,
  //     UserId: userId,
  //     nexusId: null,
  //     body,
  //   });
  //   return res.status(200).send("Comment added successfully");
  // } 
  // if(parentId) {
  //   const reply = await db.Comments.create({
  //     PostId: null,
  //     UserId: userId,
  //     nexusId: null,
  //     body,
  //   })
  //   await db.Comments.update({nexusId: reply.id } , {
  //     where: { id: parentId }
  //   })
  //   return res.status(200).send("reply added successfully");
  // }
}
)



module.exports = router;
