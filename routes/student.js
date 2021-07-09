let router = require("express").Router();
let Student = require("../database/modals/student");
let mongoose = require("mongoose");
router.post("/getStudent", (req, res, next) => {
  let { studentID } = req.body;
  if (typeof studentID === "string") {
    let id = mongoose.Types.ObjectId(studentID);
    studentID = id;
  }
  Student.findById(studentID)
    .then((docs) => {
      res.send({
        res: true,
        msg: "Returned Student!!",
        student: docs,
      });
    })
    .catch(next);
});

module.exports = router;
