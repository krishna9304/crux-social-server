let router = require("express").Router();
let student = require("./student");
let auth = require("./auth");
let classmate = require("./classmate");
let chat = require("./chat");
let inbox = require("./inbox");
const post = require("./post");

router.use("/auth", auth);
router.use("/classmates", classmate);
router.use("/student", student);
router.use("/chats", chat);
router.use("/inbox", inbox);
router.use("/post", post);

module.exports = router;
