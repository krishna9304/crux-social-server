let router = require("express").Router();
let auth = require("./auth");

router.use("/auth", auth);

module.exports = router;
