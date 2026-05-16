const express = require("express");
const multer = require("multer");
const { authLimiter } = require("../middleware/rateLimiters");
const { activityLogger } = require("../middleware/activityLogger");
const upload = multer();
const {
  registration,
  verification,
  resendOTP,
  login,
  forgetPass,
  resetPassword,
  getprofile,
  updateUserProfile,
  refreshAccessToken,
  logout,
  changePassword,
  getAuthStatus,
  deactivateAccount,
  userStatus,
  GetAllUsers,
} = require("../controllers/authController");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const route = express.Router();

route.post(
  "/register",
  activityLogger({
    action: "REGISTER",
    entityType: "Authentication",
    getEntityName: (req) => req.body.fullName || req.body.email,
    getDetails: (req) => ({ email: req.body.email }),
  }),
  registration,
);
route.post(
  "/verifyOTP",
  activityLogger({
    action: "VERIFY_OTP",
    entityType: "Authentication",
    getEntityName: (req) => req.body.email,
  }),
  verification,
);
route.post(
  "/resendOTP",
  activityLogger({
    action: "RESEND_OTP",
    entityType: "Authentication",
    getEntityName: (req) => req.body.email,
  }),
  resendOTP,
);
route.post(
  "/login",
  authLimiter,
  activityLogger({
    action: "LOGIN",
    entityType: "Authentication",
    getEntityName: (req) => req.body.email,
  }),
  login,
);
route.post(
  "/logout",
  authMiddleWare,
  activityLogger({
    action: "LOGOUT",
    entityType: "Authentication",
    getEntityName: (req) => req.user?.email,
  }),
  logout,
);
route.post(
  "/forgetPass",
  activityLogger({
    action: "REQUEST_PASSWORD_RESET",
    entityType: "Authentication",
    getEntityName: (req) => req.body.email,
  }),
  forgetPass,
);
route.post(
  "/resetPass",
  activityLogger({
    action: "RESET_PASSWORD",
    entityType: "Authentication",
    getEntityName: (req) => req.body.email || "Password Reset",
  }),
  resetPassword,
);
route.post(
  "/changePassword",
  authMiddleWare,
  activityLogger({
    action: "CHANGE_PASSWORD",
    entityType: "Authentication",
    getEntityName: (req) => req.user?.email,
  }),
  changePassword,
);
route.get("/getprofile", authMiddleWare, getprofile);
route.put(
  "/updateUserProfile",
  authMiddleWare,
  activityLogger({
    action: "UPDATE_PROFILE",
    entityType: "User",
    getEntityName: (req) => req.user?.email,
  }),
  upload.single("avatar"),
  updateUserProfile,
);
route.post("/refreshToken", refreshAccessToken);
route.get("/getAuthStatus", authMiddleWare, getAuthStatus);
route.post(
  "/deactivateAccount",
  authMiddleWare,
  activityLogger({
    action: "DEACTIVATE_ACCOUNT",
    entityType: "User",
    getEntityName: (req) => req.user?.email,
  }),
  deactivateAccount,
);
route.put(
  "/admin/userStatus",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  activityLogger({
    action: "UPDATE_USER_STATUS",
    entityType: "User",
    getEntityName: (req) => req.body.email,
    getDetails: (req) => ({
      email: req.body.email,
      status: req.body.status,
      role: req.body.role,
    }),
  }),
  userStatus,
);
route.get(
  "/admin/users",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  GetAllUsers,
);

module.exports = route;
