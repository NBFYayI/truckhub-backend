const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// Import routes
const healthRoute = require("./routes/health");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const profileRoute = require("./routes/profile");
const postRoute = require("./routes/post");
const emailRoute = require("./routes/email");
const messageRoute = require("./routes/message");

const corsOptions = {
  origin: "http://localhost:3000", // The frontend's origin
  credentials: true, // This allows cookies to be sent
};

// Routes
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/health", healthRoute);
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/profile", profileRoute);
app.use("/post", postRoute);
app.use("/verify", emailRoute);
app.use("/message", messageRoute);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("joinRoom", (username) => {
    socket.join(username);
    console.log(`${username}joined room`);
  });
  socket.on("sendMessage", (message) => {
    console.log(message);

    io.emit("message", message);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
