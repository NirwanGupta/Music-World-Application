const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    songId: {
      type: mongoose.Schema.ObjectId,
      ref: "Song",
      required: true,
    },
    activityType: {
      type: String,
      enum: ["play", "like", "skip", "search", "add_to_playlist"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);
