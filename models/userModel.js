const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blogs");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
});
module.exports = mongoose.model("user", userSchema);
