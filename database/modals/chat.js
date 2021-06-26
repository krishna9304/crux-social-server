let mongoose = require("mongoose");

let ChatSchema = mongoose.Schema({
  sentFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },
  sentTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },
  timestamp: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("chat", ChatSchema);
