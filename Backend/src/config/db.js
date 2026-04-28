const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  // Support both variable names + hardcoded local fallback
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/aidsync";

  console.log("Connecting to MongoDB:", mongoUri.replace(/\/\/.*@/, "//***@"));

  // Bypass ISP DNS blocking by forcing Node to use Google/Cloudflare DNS
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (err) {
    console.log("Could not set custom DNS servers:", err.message);
  }

  await mongoose.connect(mongoUri);
  console.log("✅ MongoDB connected successfully");
};

module.exports = connectDB;

