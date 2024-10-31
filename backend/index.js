require("dotenv").config();
const { createServer } = require("node:http");
const express = require("express");
const app = express();
const sequelize = require("./db.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { SocketServer } = require("./src/service/SocketServer");
const { Server } = require("socket.io");
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e12,
});
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  "/api/photos",
  express.static(path.resolve(__dirname, "files", "photos")),
);

app.use(
  "/api/audio/files",
  express.static(path.resolve(__dirname, "files", "audios")),
);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(80, () => console.log(`server started on port 80`));
    io.on("connection", async (socket) => {
      await SocketServer(socket, io);
    });
  } catch (error) {
    console.log(error);
  }
};
start().then((r) => r);
