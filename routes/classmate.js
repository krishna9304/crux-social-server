let router = require("express").Router();
let Student = require("../database/modals/student");
router.post("/getClassmates", (req, res, next) => {
  let { college, year, section } = req.body;
  Student.find({ college, year, section })
    .then((docs) => {
      res.send({
        res: true,
        msg: "Returned classmates!!",
        classmates: docs,
      });
    })
    .catch(next);
});

module.exports = router;
