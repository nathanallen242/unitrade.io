const http = require("http");

const server = http.createServer();
const socketServer = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

socketServer.on("connection", (socket) => {
  console.log("A user connected");

  // Add user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    socketServer.emit("getUsers", users);
  });

  // Send message
  socket.on("sendMessage", ({ sender_id, receiver_id, text, chat_id }) => {
    const user = getUser(receiver_id);
    if (user) {
      socket.to(user.socketId).emit("retrieveMessage", {
        sender_id: sender_id,
        text: text,
        chat_id: chat_id,
      });
    }
  });
  

  // When disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    socketServer.emit("getUsers", users);
  });
});

server.listen(8900, () => {
  console.log("Socket.IO server is running on port 8900");
});
