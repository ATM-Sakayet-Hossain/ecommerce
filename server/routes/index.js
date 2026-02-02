const express = require("express");
const route = express.Router();
const authRoute = require("./auth");
const productRoute = require("./product");
const CategoryRoute = require("./category")

route.get("/", (req, res) => {
  res.send("API is working properly");
});

route.use("/auth", authRoute);
route.use("/category", CategoryRoute);
route.use("/product", productRoute);


module.exports = route;