const express = require("express");
const { registration, verification, resendOTP, login, forgetPass, resetPass } = require("../controllers/authController");
const route = express.Router();

route.post("/registration", registration)
route.post("/verification", verification)
route.post("/resendOTP", resendOTP)
route.post("/login", login)
route.post("/forgetPass", forgetPass)
route.post("/resetPass/:token", resetPass)
// route.post("/resetPass/:token", resetPass)

module.exports = route;