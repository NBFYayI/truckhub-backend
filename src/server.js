const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");

// Import routes
const healthRoute = require("./routes/health");

// Routes
app.use(cors());
app.use("/health", healthRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
