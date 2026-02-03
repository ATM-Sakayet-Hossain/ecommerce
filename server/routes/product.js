const express = require("express");
const { createProduct } = require("../controllers/createProduct");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const multer = require("multer");
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

module.exports = route;
