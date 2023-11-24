
const io = require("socket.io");
const http = require("http");

const server = http.createServer();
const socketServer = require("socket.io")(server, {
  cors: {
    origin: ["http://127.0.0.1:5173"],
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
  console.log("connected");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    socketServer.emit("getUsers", users);
    
  }
  );

  // Send message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    console.log(receiverId+ " " + senderId + " " + text);
    const user = getUser(receiverId);
    console.log(user);
    if (user) {
      socketServer.to(user.socketId).emit("retriveMessage", {
        senderId,
        text,
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
  console.log("Socket.IO server is running on port 8900 (HTTPS)");
});