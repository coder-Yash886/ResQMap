const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const requestRoutes = require("./routes/requestRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// CORS configuration - Relaxed for debugging
app.use(cors());
app.options("/{*path}", cors()); 
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AidSync backend is running",
  });
});

app.use(errorHandler);

module.exports = app;
