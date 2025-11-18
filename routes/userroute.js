const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.get("/", (req, res) => {
  res.render("signup");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/profile", (req, res) => {
  res.render("profile");
});
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ error: "user already exist" });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hashpassword) => {
      let user = await User.create({
        username,
        email,
        password: hashpassword,
      });
      res.status(201).json({
        success: true,
        message: "user created successfully please login",
      });
    });
  });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Something went wrong" });
  let match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Something went wrong" });
  let token = jwt.sign({ email, user: user._id }, "ash");
  res.cookie("token", token);
  res.status(201).json({ success: true, message: "user login successfuly" });
});
module.exports = router;
