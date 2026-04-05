const express = require("express");
const { checkOut, getAllOrders, updateOrder } = require("../controllers/orderController");
const route = express.Router();

route.post("/checkout", checkOut)
route.get("/get", getAllOrders)
route.put("/admin/update/:orderId", updateOrder)

module.exports = route;