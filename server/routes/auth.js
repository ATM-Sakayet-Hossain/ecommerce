const express = require("express");
const multer = require("multer")
const upload = multer()
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
} = require("../controllers/authController");
const authMiddleWare = require("../middleware/authMiddleWare");
const route = express.Router();

route.post("/registration", registration);
route.post("/verifyOTP", verification);
route.post("/resendOTP", resendOTP);
route.post("/login", login);
route.post("/logout", authMiddleWare, logout)
route.post("/forgetPass", forgetPass);
route.post("/resetPass", resetPassword);
route.post("/changePassword", authMiddleWare, changePassword)
route.get("/getprofile", authMiddleWare, getprofile);
route.put("/updateUserProfile", authMiddleWare, upload.single("avatar"), updateUserProfile);
route.post("/refreshToken", refreshAccessToken)
route.get("/getAuthStatus", authMiddleWare, getAuthStatus)
route.post("/deactivateAccount", authMiddleWare, deactivateAccount)
route.put("/userStatus", authMiddleWare, roleCheckMiddleware("admin"), userStatus)

module.exports = route;
