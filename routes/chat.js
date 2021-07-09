let router = require("express").Router();
let Student = require("../database/modals/student");
let Chat = require("../database/modals/chat");
router.post("/addChat", (req, res, next) => {
  let { to, from, msg } = req.body;
  let chat = new Chat({
    sentFrom: from,
    sentTo: to,
    msg: msg,
    timestamp: String(Date.now()),
  });
  chat
    .save()
    .then(() => {
      res.send({
        res: true,
        msg: "Chat saved successfully!!",
      });
    })
    .catch(next);
});
router.post("/getChats", (req, res, next) => {
  let { to, id } = req.body;
  let userChats = [];
  Chat.find({ sentFrom: id, sentTo: to }).then((docs1) => {
    userChats.push(...docs1);
    Chat.find({ sentFrom: to, sentTo: id }).then((docs2) => {
      if (String(to) !== String(id)) {
        userChats.push(...docs2);
      }
      userChats = arrange(userChats);
      res.send({
        res: true,
        chats: userChats,
      });
    });
  });
});

let arrange = (chats) => {
  return chats.sort((x, y) => {
    return parseInt(x.timestamp) - parseInt(y.timestamp);
  });
};

module.exports = router;
