const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const profileVerify = require("./middleware/profileRoute");

// Import routes
const healthRoute = require("./routes/health");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const profileRoute = require("./routes/profile");
const postRoute = require("./routes/post");

// Routes
app.use(cors());
app.use(express.json());
app.use("/health", healthRoute);
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/profile", profileVerify, profileRoute);
app.use("/post", postRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
