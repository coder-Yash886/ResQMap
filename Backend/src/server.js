require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { initializeFirebase } = require("./config/firebase");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    initializeFirebase();

    app.listen(PORT, () => {
      console.log(`AidSync backend server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
