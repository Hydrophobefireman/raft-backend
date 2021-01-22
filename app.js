const express = require("express");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();
const baseRouter = require("./routes");
const { wait } = require("./models");

const port = process.env.PORT || 5000;
const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", baseRouter);

wait().then(() => {
  console.log("Database connected.. starting web server");
  app.listen(port, () => {
    console.log("Started Web Server");
  });
});
