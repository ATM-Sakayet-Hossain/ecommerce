const express = require("express");
const route = express.Router();
const authRoute = require("./auth");
const productRoute = require("./product");
const CategoryRoute = require("./category")
const cartRoute = require("./cart")
const orderRoute = require("./order");
const bannerRoute = require("./banner");
const activityLogRoute = require("./activityLog");
const reviewRoute = require("./review");
const authMiddleWare = require("../middleware/authMiddleWare");

route.get("/", (req, res) => {
  res.send("API is working properly");
});

route.use("/auth", authRoute);
route.use("/category", CategoryRoute);
route.use("/product", productRoute);
route.use("/cart", authMiddleWare, cartRoute);
route.use("/banner", bannerRoute);
route.use("/review", reviewRoute);
route.use("/activity-logs", activityLogRoute);
route.use("/order", authMiddleWare, orderRoute);


module.exports = route;