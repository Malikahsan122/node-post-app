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
  res.render("profile", { user, editPost: null });
});
router.get("/like/:id", auth, async (req, res) => {
  let post = await postModel.findById(req.params.id).populate("user");
  if (post.likes.indexOf(req.user.user) == -1) {
    post.likes.push(req.user.user);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.user), 1);
  }
  await post.save();
  res.redirect("/profile");
});
router.get("/edit/:id", auth, async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).populate("posts");
  const editPost = user.posts.find(
    (post) => post._id.toString() === req.params.id
  );
  res.render("profile", { user, editPost });
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
router.put("/edit/:id", auth, async (req, res) => {
  try {
    await postModel.findByIdAndUpdate(req.params.id, {
      content: req.body.content,
    });

    res.json({ success: true, message: "Post updated successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.get("/delete/:id", auth, async (req, res) => {
  await postModel.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(req.user.user, {
    $pull: { posts: req.params.id },
  });
  res.redirect("/profile");
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});
module.exports = router;
