const express = require("express");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const { activityLogger } = require("../middleware/activityLogger");
const {
  checkOut,
  getAllOrders,
  getOrderByNumber,
  updateOrder,
} = require("../controllers/orderController");
const route = express.Router();

route.post(
  "/checkout",
  activityLogger({
    action: "PLACE_ORDER",
    entityType: "Order",
    getEntityName: (req) => req.body.cartId,
  }),
  checkOut,
);
route.get("/get", getAllOrders);
route.get("/detail/:orderNumber", getOrderByNumber);
route.put(
  "/admin/update/:orderId",
  roleCheckMiddleware("admin", "editor"),
  activityLogger({
    action: "UPDATE_ORDER",
    entityType: "Order",
    getEntityName: (req) => req.params.orderId,
  }),
  updateOrder,
);

module.exports = route;
