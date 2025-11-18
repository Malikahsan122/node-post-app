const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const postModel = require("../models/postModel");
router.get("/", (req, res) => {
  res.render("signup");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/profile", auth, async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).populate("posts");
  console.log(user);
  res.render("profile", { user });
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
router.post("/profile", auth, async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user.email });
    let { content } = req.body;
    let post = await postModel.create({
      content,
      user: user._id,
    });
    user.posts.push(post._id);
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "post created succussfully" });
  } catch (e) {
    console.log(e.message);
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});
module.exports = router;
