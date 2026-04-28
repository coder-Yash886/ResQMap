require("dotenv").config(); // MUST be at top

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Attach Socket.io only if the package is installed
    try {
      const { initSocket } = require("./sockets/notificationSocket");
      initSocket(httpServer, app);
      console.log("[Socket.io] Real-time notifications enabled");
    } catch (e) {
      // socket.io not installed — run without real-time features
      console.warn("[Socket.io] Not available, running without real-time notifications.");
      console.warn("  → Run: npm install socket.io  to enable it.");
      // Set a dummy no-op so controllers don't crash
      app.set("io", null);
    }

    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

console.log("ENV CHECK:", process.env.MONGODB_URI ? "MONGODB_URI loaded ✓" : "MONGODB_URI missing ✗");
startServer();