let mongoose = require("mongoose");

let PostSchema = mongoose.Schema({
  picture: {
    type: String,
  },
  caption: {
    type: String,
    default: "",
  },
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },
});

module.exports = mongoose.model("post", PostSchema);
