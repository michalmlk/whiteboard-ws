import { DrawLineEvent } from "./model";

declare var require: any;

const http = require("http");
const express = require("express");

import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected successfully!");

  socket.on("draw-line", ({ prevPoint, currPoint, color }: DrawLineEvent) => {
    console.log(prevPoint, currPoint);
    socket.broadcast.emit("draw-line", { prevPoint, currPoint, color });
  });
});

server.listen(3000, () => {
  console.log("⚡️Server is running on port 3000");
});
