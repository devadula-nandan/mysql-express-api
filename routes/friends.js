const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { Op } = require("sequelize");

// db models
const db = require("../models");

// get all friends
router.get("/all", verifyToken, async (req, res, next) => {
    try {
        const friends = await db.Friends.findAll({
            where: {
                [Op.or]: [
                    { userId: req.user.id },
                    { friendId: req.user.id }
                ]
            },
            include: [
                {
                    model: db.User,
                    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
                    as: 'Friend'
                },
                {
                    model: db.User,
                    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
                    as: 'User'
                }
            ],
            attributes: { exclude: ["userId", "friendId", "UserId", "FriendId", "createdAt", "updatedAt"] }
        });
        res.status(200).json(friends);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


// accept friend request
router.post("/accept/:friendId", verifyToken, async (req, res, next) => {
    console.log(req.params.friendId); 
    console.log(req.user.id);
    try {
        const friend = await db.Friends.findOne({
            where: { friendId: req.user.id , userId: req.params.friendId },
        })
        if (!friend) {
            return res.status(404).json({ message: "Friend not found" });
        }
        await db.Friends.update({ status: true }, { where: { friendId: req.user.id , userId: req.params.friendId  } });
        res.status(200).json(friend);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

// request to add a friend
router.post("/request", verifyToken, async (req, res, next) => {
    const { id: friendId } = req.query
    try {
        // check if already friend
        let friend = await db.Friends.findOne({
            where: { friendId: friendId, userId: req.user.id },
        })
        if (friend) {
            if (friend.status) {
                return res.status(400).json({ message: "Already friend" });
            } else {
                return res.status(400).json({ message: "Already sent request" });
            }
        }
        if(friendId === req.user.id) {
            return res.status(400).json({ message: "Cannot add yourself" });
        }

        friend = await db.Friends.create({
            UserId: req.user.id,
            FriendId: friendId
        })
        res.status(200).json(friend);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

module.exports = router