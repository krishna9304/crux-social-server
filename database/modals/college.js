let mongoose = require("mongoose");

let CollegeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  student: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  club: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("college", CollegeSchema);
