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
  res.status(500).send({
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

let io = socket(server);

io.sockets.on("connection", (soc) => {
  console.log(soc.id);
  soc.on("comment", (comment) => {
    console.log(comment);
  });
});
