const express = require("express");
// const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const logger = require("electron-log");

const app = express();
const port = process.env.PORT || 4999;

app.get("/health", (req, res) => {
  res.send("OK");
});

app.use("/", express.static(path.join(__dirname, "../client/build")));

const server = http.createServer(app);

const io = socketIo(server);

let onlySocket;
io.on("connection", (socket) => {
  onlySocket = socket;
  logger.info("New client connected");
  socket.on("disconnect", () => {
    logger.info("Client disconnected");
  });
});

// const getApiAndEmit = (socket) => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
// };

server.fire = (line) => {
    // logger.debug(line)
  onlySocket?.emit("FromAPI", line);
};

exports.server = server;
