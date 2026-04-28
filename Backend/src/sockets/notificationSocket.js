/**
 * Socket.io notification setup.
 * Attaches socket.io to the HTTP server and sets the io instance on the Express app.
 *
 * Events emitted by the server:
 *  - new_request        → when a new need request is created
 *  - request_assigned   → when a volunteer accepts a request
 *  - request_updated    → generic status update
 *  - request_completed  → when a request is marked complete
 *  - allocation_run     → when the auto-match engine runs
 */
const { Server } = require("socket.io");

const initSocket = (httpServer, app) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH"],
    },
  });

  // Store io on app so controllers can emit events
  app.set("io", io);

  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  console.log("[Socket] Socket.io initialized");
  return io;
};

module.exports = { initSocket };
