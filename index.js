const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + "/src"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./src");

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/detail", (req, res) => {
  res.render("detail");
});

let messages = [];
let users = [];

io.on("connection", (socket) => {
  users[socket.id] = {};
  socket.on("disconnect", () => {
    console.log("connection disconnected");
  });
  socket.on("message", (data) => {
    const { username, message } = data;
    messages.push({ username, message });

    io.emit("message", {
      username,
      message,
    });
  });

  socket.emit("messages", messages);
});

server.listen(3000, () => {
  console.log(`listening on *:${3000}`);
});
