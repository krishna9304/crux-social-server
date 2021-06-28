let mongoose = require("mongoose");

let StudentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  regdNo: {
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
    default:
      "https://gravatar.com/avatar/ff132d7a9198e684f60c7f61b00bc757?s=200&d=mp&r=x",
  },
  coverPhoto: {
    type: String,
    default:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeYAAABoCAMAAAATgKPhAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BMQEAAADCoPVPbQlPoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC+BsXYAAGDbdwQAAAAAElFTkSuQmCC",
  },
  email: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "This is my bio",
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
