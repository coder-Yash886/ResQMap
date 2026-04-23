const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AidSync backend is running",
  });
});

module.exports = app;
