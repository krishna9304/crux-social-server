let mongoose = require("mongoose");

let StudentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profilepPic: {
    type: String,
    required: true,
  },
  coverPhoto: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
  ],
  section: {
    type: String,
    required: true,
  },
  clubs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "club",
    },
  ],
});

module.exports = mongoose.model("student", StudentSchema);
