const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");

// Import routes
const healthRoute = require("./routes/health");
const loginRoute = require("./routes/login");

// Routes
app.use(cors());
app.use(express.json());
app.use("/health", healthRoute);
app.use("/login", loginRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
