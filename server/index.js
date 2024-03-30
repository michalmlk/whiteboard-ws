const http = require("http");
const url = require("url");
const uuidv4 = require("uuid").v4;

const { WebSocketServer } = require("ws");

const PORT = 3000;
const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const connections = {};
const users = {};

//trigger updates (every user can see fresh data)
const broadcastHandler = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleClose = (uuid) => {
  console.log(`User ${users[uuid].name} disconected.`);
  delete connections[uuid];
  delete users[uuid];

  broadcastHandler();
};

const handleMessage = (b, uuid) => {
  const user = users[uuid];

  console.log(
    `${user.name} updated his/her state to be x:${user.state.x}, y: ${user.state.y}`,
  );
  const message = JSON.parse(b.toString());
  user.state.x = message.x;
  user.state.y = message.y;

  broadcastHandler();
};

wsServer.on("connection", (connection, request) => {
  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4();

  console.log(username, uuid);

  connections[uuid] = connection;
  users[uuid] = {
    name: username,
    id: uuid,
    state: {},
  };

  connection.on("message", (mess) => handleMessage(mess, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
