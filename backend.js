const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 3001, path: "/api/ws" });

wss.on("connection", (socket) => {
  console.log("connected!");

  socket.on("message", (message) => {
    console.log("received: %s", message);

    socket.send(message.toString());
  });
});
