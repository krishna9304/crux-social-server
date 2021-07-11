let router = require("express").Router();
let Student = require("../database/modals/student");
let multer = require("multer");
let Post = require("../database/modals/post");
const Comment = require("../database/modals/comment");

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
  let isDev = process.env.NODE_ENV !== "production";
  let data = req.body;
  console.log(req.file);
  if (req.file) {
    const url =
      req.protocol +
      "://" +
      (isDev ? "locahost:8080" : "crux-social-api.herokuapp.com") +
      "/" +
      req.file.filename;
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

router.post("/like", (req, res, next) => {
  let { postId, userId } = req.body;
  console.log(userId);
  Post.findById(postId)
    .then((doc) => {
      if (doc.likes.includes(String(userId))) {
        doc.likes.splice(doc.likes.indexOf(userId));
        doc
          .save()
          .then((final) => {
            res.send({
              res: true,
              post: final,
              msg: "unLiked ;-)",
            });
          })
          .catch(next);
      } else {
        doc.likes = [String(userId), ...doc.likes];
        doc
          .save()
          .then((final) => {
            res.send({
              res: true,
              post: final,
              msg: "Liked ;-)",
            });
          })
          .catch(next);
      }
    })
    .catch(next);
});

router.post("/addcomment", (req, res, next) => {
  let { commentedBy, comment, postId } = req.body;
  let comm = new Comment({ comment, commentedBy });
  comm
    .save()
    .then((doc) => {
      Post.findById(postId)
        .then((postDoc) => {
          postDoc.comment = [...postDoc.comment, doc._id];
          postDoc
            .save()
            .then((final) => {
              res.send({
                res: true,
                msg: "Commented",
                comment: final,
              });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

router.post("/getcomments", (req, res, next) => {
  let { ids } = req.body;
  let comments = [];
  for (let i = 0; i < ids.length; i++) {
    id = ids[i];
    Comment.findById(id)
      .then((doc) => {
        comments.push(doc);
        if (i === ids.length - 1) {
          res.send({
            res: true,
            comments,
          });
        }
      })
      .catch(next);
  }
});

let arrange = (timeline) => {
  return timeline.sort((x, y) => {
    return parseInt(x.timestamp) - parseInt(y.timestamp);
  });
};

module.exports = router;
