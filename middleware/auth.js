const jwt = require("jsonwebtoken");
module.exports = function auth(req, res, next) {
  let token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  let decoded = jwt.verify(token, "ash");
  req.user = decoded;
  next();
};
