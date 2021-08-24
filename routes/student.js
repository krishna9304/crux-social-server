let router = require("express").Router();
let Student = require("../database/modals/student");
let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let Post = require("../database/modals/post");

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

router.post("/updateStudent", (req, res, next) => {
  let data = req.body;
  Student.findById(data._id)
    .then((doc) => {
      if (doc.year !== data.year) {
        doc.year = data.year;
      }
      if (doc.section !== data.section) {
        doc.section = data.section;
      }
      if (doc.bio !== data.bio) {
        doc.bio = data.bio;
      }
      if (data.password !== "") {
        bcrypt.hash(data.password, 10, (err, enc_pass) => {
          if (err) next(err);
          doc.password = enc_pass;
          doc
            .save()
            .then((doc2) => {
              console.log(doc2);
              res.send({
                res: true,
                userData: doc2,
              });
            })
            .catch(next);
        });
      } else {
        doc
          .save()
          .then((doc2) => {
            console.log(doc2);
            res.send({
              res: true,
              userData: doc2,
            });
          })
          .catch(next);
      }
    })
    .catch(next);
});

router.post("/showPosts", (req, res, next) => {
  let { studentID } = req.body;
  Post.find({ postedBy: studentID })
    .then((docs) => {
      res.send({
        res: true,
        posts: docs.reverse(),
      });
    })
    .catch(next);
});

module.exports = router;
