const express = require("express");
const { registration } = require("../controllers/authController");
const route = express.Router();

route.post("/registration", registration)

module.exports = route;