require("dotenv").config();
const http = require("http");
const express = require("express");
const timerAllUsers = express();
const sequelize = require("./db.js");
const bodyParser = require("body-parser");
const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
const relativeTime = require("dayjs/plugin/relativeTime");
const localizedFormat = require("dayjs/plugin/localizedFormat");
const cors = require("cors");
const { UpdateRedisInfo } = require("./src/Controllers/StoreRedis");
timerAllUsers.use(cors());
const server = http.createServer(timerAllUsers);
timerAllUsers.use(express.json());
timerAllUsers.use(bodyParser.json());
timerAllUsers.use(bodyParser.urlencoded({ extended: true }));
dayjs.extend(isBetween);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(5000, () => console.log(`server started on port 5000`));
    await UpdateRedisInfo();
  } catch (error) {
    console.log(error);
  }
};
start().then((r) => r);
