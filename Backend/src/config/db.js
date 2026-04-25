const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // Bypass ISP DNS blocking by forcing Node to use Google/Cloudflare DNS
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    console.log("Custom DNS servers set to bypass local DNS blocks");
  } catch (err) {
    console.log("Could not set custom DNS servers:", err.message);
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully");
};

module.exports = connectDB;
