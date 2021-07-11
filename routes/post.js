let router = require("express").Router();
let Student = require("../database/modals/student");
let multer = require("multer");
let Post = require("../database/modals/post");
const { v4: uuidv4 } = require("uuid");
const student = require("../database/modals/student");

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

router.post("/gettimeline", (req, res, next) => {
  let { id } = req.body;
  let timeline = [];
  Student.findById(id)
    .then((doc) => {
      let { college, year, section } = doc;
      Student.find({ college, year, section })
        .then((docs) => {
          for (let i = 0; i < docs.length; i++) {
            let student = docs[i];
            Post.find({ postedBy: student._id })
              .then((posts) => {
                timeline.push(...posts);
                if (i === docs.length - 1) {
                  console.log(timeline);
                  timeline = arrange(timeline);
                  res.send({
                    res: true,
                    timeline: timeline.reverse(),
                  });
                }
              })
              .catch(next);
          }
        })
        .catch(next);
    })
    .catch(next);
});

let arrange = (timeline) => {
  return timeline.sort((x, y) => {
    return parseInt(x.timestamp) - parseInt(y.timestamp);
  });
};

module.exports = router;
