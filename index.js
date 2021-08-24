require("dotenv").config();
const chalk = require("chalk");
const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
let routes = require("./routes");
let cookieParser = require("cookie-parser");
const Student = require("./database/modals/student");

let PORT = process.env.PORT || 8080;
let isDev = process.env.NODE_ENV !== "production";
const app = express();

require("./database");

//all the middlewares
app.use(cors({}));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use("/api/v1", routes);
app.use(cookieParser());

//error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.send({
    msg: "There was some problem. Please check your request or try again after some time",
    res: false,
    error: isDev ? err : "Please contact the developer for more info",
  });
});

let server = app.listen(PORT, "0.0.0.0", () => {
  console.clear();
  console.log(
    chalk.bgGreen(
      `  Server started on PORT ${chalk.underline(
        chalk.bold(PORT)
      )} at ${Date()}`
    )
  );
});

let clients = [];

let io = socket(server);

io.sockets.on("connection", (soc) => {
  clients.push(soc);
  showAllClients();

  soc.on("comment", (comment) => {
    console.log(comment);
  });
  soc.on("USER_ID", (id) => {
    console.log(id);
    let tempClients = [];
    for (let client of clients) {
      if (client.id === soc.id) {
        client._id = id;
      }
      tempClients.push(client);
    }
    clients = tempClients;
    for (let client of clients) {
      if (client.id == soc.id) {
        realTimeUsers(client);
      }
    }
    showAllClients();
  });
  soc.on("GET_ONLINE_USERS", (id) => {
    getOnlineUser(id, soc);
  });
  soc.on("NEW_MSG", (data) => {
    soc.emit("NEW_MSG", data);
    if (String(data.sentFrom) !== String(data.sentTo)) {
      for (let client of clients) {
        if (String(client._id) === String(data.sentTo)) {
          client.emit("NEW_MSG", data);
        }
      }
    }
  });
  soc.on("disconnect", () => {
    let tempClients = [];
    for (let client of clients) {
      if (client.id != soc.id) {
        tempClients.push(client);
      } else {
        realTimeUsers(client);
      }
    }
    clients = tempClients;
    showAllClients();
  });
});

let showAllClients = () => {
  console.clear();
  console.log(
    chalk.cyanBright(
      `\nServer started on PORT ${chalk.underline(
        chalk.bold(PORT)
      )} at ${Date()}`
    )
  );
  console.log();

  if (clients.length > 0) {
    console.log(chalk.bold(chalk.whiteBright("  Clients connected")));
  } else {
    console.log(chalk.bold(chalk.whiteBright("  No  Clients connected")));
  }
  console.log();

  for (let i = 0; i < clients.length; i++) {
    if (!clients[i].disconnected) {
      if (i == clients.length - 1) {
        console.log(
          chalk.yellowBright(
            chalk.bold(`• ${clients[i]._id ? clients[i]._id : clients[i].id} `)
          )
        );
      } else {
        console.log(
          chalk.cyanBright(
            chalk.bold(`• ${clients[i]._id ? clients[i]._id : clients[i].id} `)
          )
        );
      }
    }
  }
  console.log(
    chalk.cyanBright(chalk.bold(`\n  Total connections: ${clients.length} `))
  );
};

let getOnlineUser = (id, soc) => {
  let college = null,
    year = null,
    section = null;
  Student.findById(id)
    .then((doc) => {
      college = doc.college;
      year = doc.year;
      section = doc.section;
      Student.find({ college, year, section })
        .then((docs) => {
          let onlineUsers = [];
          for (let student of docs) {
            for (let client of clients) {
              if (
                String(student._id) === String(client._id) &&
                !clientIsInside(onlineUsers, client)
              )
                onlineUsers.push(student);
            }
          }
          soc.emit("ONLINE_USERS", onlineUsers);
        })
        .catch(console.log);
    })
    .catch((err) => console.log(err));
};

let clientIsInside = (onlineUsers, client) => {
  for (let user of onlineUsers) {
    if (String(user._id) === String(client._id)) return true;
  }
  return false;
};

let realTimeUsers = (client) => {
  Student.findById(client._id)
    .then((doc) => {
      college = doc.college;
      year = doc.year;
      section = doc.section;
      Student.find({ college, year, section })
        .then((docs) => {
          for (let student of docs) {
            for (let client of clients) {
              if (String(student._id) === String(client._id))
                getOnlineUser(client._id, client);
            }
          }
        })
        .catch(console.log);
    })
    .catch((err) => console.log(err));
};
