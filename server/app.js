require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;

const EVENTS = {
  DRAW: "draw",
  CLEAR_CANVAS: "clearCanvas",
  LOAD_CANVAS: "loadCanvas",
  USER_NOTIFICATION: "userNotification",
  UPDATE_USERS: "updateUsers",
};

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let users = new Set();
let drawingHistory = [];

io.on("connection", (socket) => {
  users.add(socket.id);
  io.emit(EVENTS.UPDATE_USERS, users.size);

  io.emit(EVENTS.USER_NOTIFICATION, { message: `User ${socket.id} connected` });

  socket.emit(EVENTS.LOAD_CANVAS, drawingHistory);

  socket.on(EVENTS.DRAW, (data) => {
    drawingHistory.push(data);
    socket.broadcast.emit(EVENTS.DRAW, data);
  });

  socket.on(EVENTS.CLEAR_CANVAS, () => {
    drawingHistory = [];
    io.emit(EVENTS.CLEAR_CANVAS);
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    io.emit(EVENTS.UPDATE_USERS, users.size);
    io.emit(EVENTS.USER_NOTIFICATION, { message: `User ${socket.id} disconnected` });
  });
});

app.use(cors());
app.get("/", (req, res) => {
  res.send("WebSocket server is running!");
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
