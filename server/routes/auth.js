const express = require("express");
const { registration, verification, resendOTP, login, forgetPass, resetPassword } = require("../controllers/authController");
const route = express.Router();

route.post("/registration", registration)
route.post("/verification", verification)
route.post("/resendOTP", resendOTP)
route.post("/login", login)
route.post("/forgetPass", forgetPass)
route.post("/resetPass", resetPassword)

module.exports = route;