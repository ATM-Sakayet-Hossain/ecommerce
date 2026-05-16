const express = require("express");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const { getActivityLogs } = require("../controllers/activityLogController");

const route = express.Router();

route.get(
  "/admin/get",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  getActivityLogs,
);

module.exports = route;