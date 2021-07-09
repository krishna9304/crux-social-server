let router = require("express").Router();
let Student = require("../database/modals/student");
let Chat = require("../database/modals/chat");
router.post("/getInbox", (req, res, next) => {
  let { id } = req.body;
  let chats = [];
  let users = [];
  Chat.find({ sentFrom: id })
    .then((docs1) => {
      for (let chat of docs1) {
        chats.push(chat.sentTo);
      }
      Chat.find({ sentTo: id })
        .then((docs2) => {
          for (let chat of docs2) {
            chats.push(chat.sentTo);
          }
          users = uniqueUsers(chats);
          res.send({
            res: true,
            users: users,
          });
        })
        .catch(next);
    })
    .catch(next);
});

let uniqueUsers = (chats) => {
  let uniqueUsers = [];
  chats.forEach((c) => {
    if (!uniqueUsers.includes(String(c))) {
      uniqueUsers.push(String(c));
    }
  });
  return uniqueUsers;
};

module.exports = router;
