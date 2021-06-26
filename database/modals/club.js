let mongoose = require("mongoose");

let ClubSchema = mongoose.Schema({
  name,
  des,
  coverPhoto,
  profilePhoto,
  memberList,
  posts,
});

module.exports = mongoose.model("club", ClubSchema);
