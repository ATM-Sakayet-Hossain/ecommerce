const express = require("express");
const authMiddleWare = require("../middleware/authMiddleWare");
const { activityLogger } = require("../middleware/activityLogger");
const {
  checkOut,
  getAllOrders,
  updateOrder,
} = require("../controllers/orderController");
const route = express.Router();

route.post(
  "/checkout",
  authMiddleWare,
  activityLogger({
    action: "PLACE_ORDER",
    entityType: "Order",
    getEntityName: (req) => req.body.cartId,
  }),
  checkOut,
);
route.get("/get", getAllOrders);
route.put(
  "/admin/update/:orderId",
  authMiddleWare,
  activityLogger({
    action: "UPDATE_ORDER",
    entityType: "Order",
    getEntityName: (req) => req.params.orderId,
  }),
  updateOrder,
);

module.exports = route;
