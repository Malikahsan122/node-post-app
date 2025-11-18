const express = require("express");
const app = express();
const path = require("path");
const User = require("./models/userModel");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("signup");
});
app.post("/register", async (req, res) => {
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
      let token = jwt.sign({ email, user: user._id }, "ash");
      res.cookie("token", token);
      res.status(201).json({ message: "user created successfully" });
    });
  });
});
app.listen(3000, () => {
  console.log("listening on port 3000");
});
