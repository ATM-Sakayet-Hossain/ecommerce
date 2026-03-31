const express = require("express");
const { checkOut } = require("../controllers/orderController");
const route = express.Router();

route.post("/checkout", checkOut)

module.exports = route;