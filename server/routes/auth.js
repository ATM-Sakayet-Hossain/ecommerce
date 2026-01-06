const express = require("express");
const { registration, verification } = require("../controllers/authController");
const route = express.Router();

route.post("/registration", registration)
route.post("/verification", verification)

module.exports = route;