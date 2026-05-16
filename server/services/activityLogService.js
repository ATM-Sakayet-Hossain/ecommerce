const activityLogSchema = require("../models/activityLogSchema");

const createActivityLog = async (payload) => {
  try {
    await activityLogSchema.create(payload);
  } catch (error) {
    console.error("Activity log save failed:", error);
  }
};

module.exports = { createActivityLog };
