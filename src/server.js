const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import routes
const healthRoute = require("./routes/health");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const profileRoute = require("./routes/profile");
const postRoute = require("./routes/post");

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
