const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    requesterId: {
      type: String,
      default: "anonymous",
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "closed"],
      default: "pending",
    },
    matchedResourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", requestSchema);
