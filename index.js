const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/users", require("./control/UserAPI"));
app.use("/chars", require("./control/CharAPI"));
app.use("/install", require('./control/InstallAPI'));

app.listen(3001, () => {
  console.log("Listening...");
});
