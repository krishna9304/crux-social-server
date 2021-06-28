let router = require("express").Router();
let auth = require("./auth");
let classmate = require("./classmate");

router.use("/auth", auth);
router.use("/classmates", classmate);

module.exports = router;
