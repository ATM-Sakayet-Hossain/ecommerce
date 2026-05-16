const express = require("express");
const route = express.Router();
const authRoute = require("./auth");
const productRoute = require("./product");
const CategoryRoute = require("./category")
const cartRoute = require("./cart")
const orderRoute = require("./order");
const bannerRoute = require("./banner");
const activityLogRoute = require("./activityLog");
const authMiddleWare = require("../middleware/authMiddleWare");

route.get("/", (req, res) => {
  res.send("API is working properly");
});

route.use("/auth", authRoute);
route.use("/category", CategoryRoute);
route.use("/product", productRoute);
route.use("/cart", authMiddleWare, cartRoute);
route.use("/banner", bannerRoute);
route.use("/activity-logs", activityLogRoute);
route.use(authMiddleWare, orderRoute);


module.exports = route;