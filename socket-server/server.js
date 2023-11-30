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

const addUser = (userId, socketId, username = "Unknown") => {
  if (!users.some(user => user.userId === userId)) {
    users.push({ userId, socketId, username });
  }
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
  socket.on("addUser", (data) => {
    const { userId, username } = data;
    addUser(userId, socket.id, username);
    socketServer.emit("getUsers", users);
  });
  

  // Send message
  socket.on("sendMessage", ({ sender_id, receiver_id, text, chat_id }) => {
    const user = getUser(receiver_id);
    const sender = getUser(sender_id);
    console.log("sender: ", sender);
    if (user) {
      // Emit event to retrieve the actual message
      socket.to(user.socketId).emit("retrieveMessage", {
        sender_id: sender_id,
        text: text,
        chat_id: chat_id,
      });

    // Emit a more descriptive notification event
    socket.to(user.socketId).emit("sendNotification", {
      type: "new_message", // Type of notification
      message: "You have a new message", // General notification message
      from: sender.username, // ID of the sender
      preview: text.length > 30 ? text.substring(0, 30) + "..." : text, // Preview of the message, limit to 30 characters
      chat_id: chat_id, // Chat ID can be useful for navigation
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
