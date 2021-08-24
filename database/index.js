const chalk = require("chalk");
let mongoose = require("mongoose");

const uri = `mongodb+srv://cruxdb:UHAjUb37pVbj12dZ@cluster0.js5ib.mongodb.net/cruxdb?retryWrites=true&w=majority`;
console.log(chalk.bgRedBright(uri));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

db.on("open", () => {
  console.log("Conncected to the database successfully");
});

db.once("error", () => {
  console.error("There was some problem connecting to the database");
});
