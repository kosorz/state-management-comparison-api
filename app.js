import express from "express";
import bodyParser from "body-parser";

import socket from "./socket";

const app = express();

app.use(bodyParser.urlencoded())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Player"
  );
  res.setHeader("Access-Control-Max-Age", "7200");
  next();
});

const form = `
    <div style="display: flex; align-items: center; margin: auto; flex-wrap: wrap; flex-direction: column;">
      <form action="/settings" method="POST" style="width: 153px">
        <label for="felements">Elements:</label><br>
        <input type="number" step="1" id="felements" name="felements" max="2000" value="1000"><br>
        <label for="fms">Miliseconds:</label><br>
        <input type="number" step="1" id="fms" name="fms" max="50" value="10"><br><br>
        <input style="width: 100%" type="submit" value="Submit">
      </form>
      <hr style="width: 100%"></hr>
      <form action="/start" method="POST" style="width: 153px">
        <input style="width: 100%" type="submit" value="Start">
      </form>
    </div>
  `;

app.get("/", (req, res, next) => {
    res.send(form)
});

app.post("/start", (req, res, next) => {
    socket.getIO().emit('start');
    res.send(form)
});

app.post("/settings", (req, res, next) => {
  const { felements, fms } = req.body;
  socket.getIO().emit('settings', { ms: fms, elements: felements });
  res.send(form)
});

const startUp = () => {
  const server = app.listen(process.env.PORT || 8080);
  const io = socket.init(server);

  io.of("/").on("connection", (socket) => {
    console.log("Client connected to panel!");
  });
};

startUp();
