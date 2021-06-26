let mongoose = require("mongoose");

let CommentSchema = mongoose.Schema({
  commentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },
  comment: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("comment", CommentSchema);
