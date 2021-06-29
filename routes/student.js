let router = require("express").Router();
let Student = require("../database/modals/student");
router.post("/getStudent", (req, res, next) => {
  let { studentID } = req.body;
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
