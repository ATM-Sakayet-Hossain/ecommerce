const express = require("express");
const route = express.Router();
const authRoute = require("./auth");
const productRoute = require("./product");
const CategoryRoute = require("./category")

route.get("/", (req, res) => {
  res.send("API is working properly");
});

route.use("/auth", authRoute);
route.use("/product", productRoute);
route.use("/category", CategoryRoute);


module.exports = route;