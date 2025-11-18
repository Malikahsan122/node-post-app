const express = require("express");
const app = express();
const path = require("path");
const userroute = require("./routes/userroute");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", userroute);
app.listen(3000, () => {
  console.log("listening on port 3000");
});
