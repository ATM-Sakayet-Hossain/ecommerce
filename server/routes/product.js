const express = require("express");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const multer = require("multer");
const { createProduct, getAllProduct } = require("../controllers/ProductController");
const route = express.Router();
const upload = multer();



route.post(
  "/createProduct",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createProduct,
);
route.get("/allProduct", getAllProduct)

route.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "Maximum 4 images allowed",
    });
  }
  next();
});


module.exports = route;
