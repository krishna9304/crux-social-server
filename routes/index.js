let router = require("express").Router();
let student = require("./student");
let auth = require("./auth");
let classmate = require("./classmate");

router.use("/auth", auth);
router.use("/classmates", classmate);
router.use("/student", student);

module.exports = router;
