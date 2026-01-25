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
} = require("../controllers/authController");
const authMiddleWare = require("../middleware/authMiddleWare");
const route = express.Router();

route.post("/registration", registration);
route.post("/verification", verification);
route.post("/resendOTP", resendOTP);
route.post("/login", login);
route.post("/forgetPass", forgetPass);
route.post("/resetPass", resetPassword);
route.get("/getprofile", authMiddleWare, getprofile);
route.put("/updateUserProfile", authMiddleWare, upload.single("avatar"), updateUserProfile);
route.post("/refreshToken", refreshAccessToken)

module.exports = route;
