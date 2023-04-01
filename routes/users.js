const express = require("express");
const router = express.Router();
const { generateToken, verifyToken } = require("../middleware/auth");
const { encrypt,match } = require("../middleware/bcrypt");

// db models
const db = require("../models");

// create new user
router.post("/", encrypt, async (req, res, next) => {
  // Create a new user object
  const { username, email, password } = req.body;
  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "user already exist" });
    }
    const result = await db.User.create({
      email: email,
      password: password,
      username: username,
    }); // Generate a JWT token and send it in the response
    const token = generateToken({ email: result.email, id: result.id });
    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

// login a user
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(404).json("User not found");
    }
    if (!match(password, existingUser.password)) {
      return res.status(401).json("Incorrect password");
    }
    const token = generateToken({ email: existingUser.email, id: existingUser.id });
    res.status(201).json({ user: existingUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
