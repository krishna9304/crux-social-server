let router = require("express").Router();
let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");
let Student = require("../database/modals/student");
let College = require("../database/modals/college");
let isempty = require("isempty");
let mongoose = require("mongoose");
const chalk = require("chalk");

router.post("/register", (req, res, next) => {
  let data = req.body;
  let collegeName = data.college;
  College.findOne({ name: data.college }).then((coldoc) => {
    Student.exists(
      { regdNo: data.regdNo, college: coldoc._id },
      (err, result) => {
        if (err) next(err);
        if (result === false) {
          //passoword hashing and salting
          bcrypt.hash(data.password, 10, (err, enc_pass) => {
            if (err) next(err);

            data.password = enc_pass;
            data.college = coldoc._id;
            //saving the data to the database
            let student = new Student(data);
            student
              .save()
              .then((doc) => {
                College.findOne({ name: collegeName }).then((collegeDoc) => {
                  console.log(collegeDoc);
                  collegeDoc.students = [...collegeDoc.students, doc._id];
                  collegeDoc.save();
                });
                res.send({
                  userdata: doc,
                  res: true,
                  msg: "Student registered successfully",
                });
              })
              .catch((err) => {
                next(err);
              });
          });
        } else {
          res.send({
            res: false,
            msg: "Student with the give regdNo number already registered",
          });
        }
      }
    );
  });
});

router.post("/login", (req, res, next) => {
  let { college, regdNo, password } = req.body;
  if (isempty(college))
    res.send({
      res: false,
      msg: "Please select a college!!",
    });
  else if (isempty(regdNo))
    res.send({
      res: false,
      msg: "Please enter your registration number!!",
    });
  else if (isempty(password))
    res.send({
      res: false,
      msg: "Please enter your password!!",
    });
  else {
    let collegeID = null;
    College.findOne({ name: college })
      .then((doc) => {
        collegeID = String(doc._id);
      })
      .catch(next);
    Student.find({ regdNo })
      .then((doc) => {
        if (doc.length === 0) {
          res.send({
            res: false,
            msg: "Wrong registration number!!",
          });
        } else {
          let found = false;
          for (let student of doc) {
            if (String(student.college) === collegeID) {
              found = true;
              let hash = student.password;
              bcrypt.compare(password, hash, (err, same) => {
                if (err) next(err);
                if (same) {
                  //successful login
                  let token = jwt.sign(
                    {
                      id: student._id,
                      name: student.name,
                      regdNo: student.regdNo,
                    },
                    process.env.JWT_PASS,
                    {
                      expiresIn: "10h",
                    }
                  );
                  res.send({
                    userdata: student,
                    college: college,
                    res: true,
                    msg: "Your login was successful.",
                    jwt: token,
                  });
                } else {
                  res.send({
                    res: false,
                    msg: "The password you have entered is incorrect",
                  });
                }
              });
            }
          }
          if (!found) {
            res.send({
              res: false,
              msg: "No user found with the registration number!!",
            });
          }
        }
      })
      .catch(next);
  }
});

router.post("/verifyToken", (req, res, next) => {
  let token = req.body.token;
  jwt.verify(token, process.env.JWT_PASS, (err, decoded) => {
    if (err) next(err);
    if (decoded) {
      Student.exists({ _id: decoded.id }, (err, result) => {
        if (err) next(err);
        if (result === true) {
          Student.findById(decoded.id, (err, doc) => {
            if (err) next(err);
            College.findById(doc.college, (err, coldoc) => {
              if (err) next(err);
              res.send({
                userdata: doc,
                college: coldoc.name,
                res: true,
              });
            });
          });
        } else {
          res.send({
            res: false,
            msg: "Student with the following token does not found in the database",
          });
        }
      });
    } else {
      res.send({
        res: false,
        msg: "Invalid Token",
      });
    }
  });
});

module.exports = router;
