const activityLogSchema = require("../models/activityLogSchema");
const { getPagination } = require("../services/helper");
const { responseHandler } = require("../Utils/responseHandler");

const getActivityLogs = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { search, action, entityType, actorRole } = req.query;

    const match = {};
    if (action) {
      match.action = action;
    }
    if (entityType) {
      match.entityType = entityType;
    }
    if (actorRole) {
      match.actorRole = actorRole;
    }
    if (search) {
      match.$or = [
        { actorName: { $regex: search, $options: "i" } },
        { actorEmail: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
        { entityType: { $regex: search, $options: "i" } },
        { entityName: { $regex: search, $options: "i" } },
        { path: { $regex: search, $options: "i" } },
      ];
    }

    const logs = await activityLogSchema
      .find(match)
      .populate("actor", "fullName email role avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await activityLogSchema.countDocuments(match);

    return responseHandler.success(
      res,
      200,
      {
        logs,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      "Activity logs fetched successfully",
    );
  } catch (error) {
    return responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

module.exports = { getActivityLogs };
