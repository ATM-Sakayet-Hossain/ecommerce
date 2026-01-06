const express = require("express");
const { registration, verification, resendOTP, login } = require("../controllers/authController");
const route = express.Router();

route.post("/registration", registration)
route.post("/verification", verification)
route.post("/resendOTP", resendOTP)
route.post("/login", login)

module.exports = route;