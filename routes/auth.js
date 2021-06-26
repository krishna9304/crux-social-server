let router = require("express").Router();
let jwt = require("jsonwebtoken");
let Student = require("../database/modals/student");

router.post("/login", (req, res, next) => {
  let { regdNo, password } = req.body;

  Student.exists({ regdNo }, (err, result) => {
    if (err) next(err);

    console.log({ err, result });

    if (result) {
      //getting the user data from the database
      Student.findOne({ regdNo })
        .then((doc) => {
          if (err) next(err);
          if (password === doc.password) {
            //successful login
            let token = jwt.sign(
              { name: doc.name, regdNo: doc.regdNo },
              process.env.JWT_PASS,
              {
                expiresIn: "2h",
              }
            );
            res.cookie("jwt", token);

            res.send({
              userdata: doc,
              res: true,
              msg: "Your login successful.",
            });
          } else {
            res.status(403).send({
              res: false,
              msg: "The password you have entered is incorrect",
            });
          }
        })
        .catch((err) => {
          next(err);
        });
    } else {
      res.status(403).send({
        res: false,
        msg: "No user was found from the given detail",
      });
    }
  });
});

router.post("/verifyToken", (req, res) => {
  let token = req.body.token;
  jwt.verify(token, process.env.JWT_PASS, (err, decoded) => {
    if (err) next(err);
    Student.exists({ regdNo: decoded.regdNo }, (err, result) => {
      if (err) next(err);
      console.log(decoded);
      if (result === true) {
        Student.findOne({ regdNo: decoded.regdNo }, (err, doc) => {
          if (err) next(err);
          console.log(doc);
          res.send({
            userdata: doc,
            res: true,
          });
        });
      } else {
        res.send({
          res: false,
          msg: "User with the following token does not found in the database",
        });
      }
    });
  });
});

module.exports = router;
