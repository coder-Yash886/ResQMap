const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // category / resourceType (same field, category is the alias)
    category: {
      type: String,
      required: true,
      enum: ["food", "medicine", "shelter", "clothes", "water", "volunteer", "funds", "other"],
      lowercase: true,
    },
    // kept for backward compat — mirrors category
    resourceType: {
      type: String,
      default: function () {
        return this.category;
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      default: "units",
      trim: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    // Rich location object with coordinates
    location: {
      address: {
        type: String,
        default: "",
        trim: true,
      },
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    // Who raised this request
    requesterId: {
      type: String,
      default: "anonymous",
    },
    requesterName: {
      type: String,
      default: "Anonymous",
    },
    requesterEmail: {
      type: String,
      default: "",
    },
    // Extended status lifecycle
    status: {
      type: String,
      enum: ["pending", "assigned", "inProgress", "completed", "closed"],
      default: "pending",
    },
    // Volunteer who accepted the request
    assignedTo: {
      type: String,
      default: null,
    },
    assignedToName: {
      type: String,
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    // Optional: linked matched resource from allocation engine
    matchedResourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      default: null,
    },
    // Feedback after completion
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      comment: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for geo-based queries
requestSchema.index({ "location.lat": 1, "location.lng": 1 });
requestSchema.index({ status: 1, urgency: 1 });

module.exports = mongoose.model("Request", requestSchema);
