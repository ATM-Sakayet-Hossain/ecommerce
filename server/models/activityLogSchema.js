const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    actorName: {
      type: String,
      default: "System",
    },
    actorEmail: {
      type: String,
    },
    actorRole: {
      type: String,
      default: "guest",
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      default: "General",
      index: true,
    },
    entityId: {
      type: String,
    },
    entityName: {
      type: String,
    },
    method: {
      type: String,
    },
    path: {
      type: String,
    },
    statusCode: {
      type: Number,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);