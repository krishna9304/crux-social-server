let router = require("express").Router();
let Student = require("../database/modals/student");
let multer = require("multer");
let Post = require("../database/modals/post");
const { v4: uuidv4 } = require("uuid");

const DIR = "./public";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, DIR);
  },
  filename: (req, file, callback) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    callback(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
      return callback(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post("/createPost", upload.single("picture"), (req, res, next) => {
  let data = req.body;
  console.log(req.file);
  if (req.file) {
    const url =
      req.protocol + "://" + "localhost:8080" + "/" + req.file.filename;
    data.picture = url;
  }
  let post = new Post(data);
  post
    .save()
    .then((doc) => {
      res.send({
        res: true,
        msg: "Posted sucessfully!!",
        post: doc,
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
