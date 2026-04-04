const express = require("express");
const { addToCart, getCart, updateCartItem, removeCartItem, clearCart } = require("../controllers/cartController");
const route = express.Router();


route.post("/add", addToCart)
route.get("/get", getCart)
route.put("/update", updateCartItem)
route.delete("/remove/:sku", removeCartItem)
route.delete("/clear", clearCart)



module.exports = route;