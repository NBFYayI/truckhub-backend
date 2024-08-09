const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["https://dc9mte7gy226s.cloudfront.net", "http://localhost:3000"], // The frontend's origin
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// Import routes
const healthRoute = require("./routes/health");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const profileRoute = require("./routes/profile");
const postRoute = require("./routes/post");
const emailRoute = require("./routes/email");
const messageRoute = require("./routes/message");
const socketVerify = require("./middleware/socketAuth");

//Import socket control
const {
  getAllMessages,
  setRead,
  sendMessage,
  userSearch,
} = require("./controllers/socket-control");

const corsOptions = {
  origin: ["https://dc9mte7gy226s.cloudfront.net", "http://localhost:3000"], // The frontend's origin
  credentials: true, // This allows cookies to be sent
};

// Routes
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/health", healthRoute);
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/profile", profileRoute);
app.use("/post", postRoute);
app.use("/verify", emailRoute);
app.use("/message", messageRoute);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const username = socket.handshake.auth.username;
  if (!token || !username) {
    return next(new Error("Authentication error"));
  }
  if (!socketVerify(username, token)) {
    return next(new Error("Authentication error"));
  }

  next();
});
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
  socket.on("login", async (username) => {
    try {
      socket.join(username);
      console.log(`${username}joined room`);
      const msgs = await getAllMessages(username);
      const user = await getAvatars(username);
      socket.emit("allMessages", msgs);
      socket.emit("currentUser", user);
    } catch (error) {
      socket.emit("myError", error.message);
    }
  });
  socket.on("readMessage", async (ids) => {
    try {
      console.log(ids);
      if (!ids || ids.length === 0) {
        throw new Error("ids required");
      }
      const result = await setRead(ids);
    } catch (error) {
      socket.emit("myError", error.message);
    }
  });
  socket.on("sendMessage", async (message) => {
    try {
      console.log(message);
      if (!message.from || !message.to || !message.content) {
        throw new Error("invalid message");
      }
      const result = await sendMessage(
        message.from,
        message.to,
        message.content
      );
      socket.emit("sendMessage", result);
      io.to(message.to).emit("sendMessage", result);
    } catch (error) {
      socket.emit("myError", error.message);
    }
  });
  socket.on("userSearch", async (keyword) => {
    try {
      const result = await userSearch(keyword);
      socket.emit("userSearch", result);
    } catch (error) {
      socket.emit("myError", error.message);
    }
  });
  socket.on("askAvatar", async (usernames) => {
    try {
      const result = await getAvatars(usernames);
      socket.emit("askAvatar", result);
    } catch (error) {
      socket.emit("myError", error.message);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
