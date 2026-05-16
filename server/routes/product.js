const express = require("express");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const { activityLogger } = require("../middleware/activityLogger");
const multer = require("multer");
const {
  createProduct,
  getAllProduct,
  getProductDetails,
  updateProduct,
} = require("../controllers/ProductController");
const route = express.Router();
const upload = multer();

route.post(
  "/createProduct",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  activityLogger({
    action: "CREATE_PRODUCT",
    entityType: "Product",
    getEntityName: (req) => req.body.title,
  }),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createProduct,
);
route.get("/admin/get",authMiddleWare, roleCheckMiddleware("admin", "editor"), getAllProduct);
route.get(
  "/admin/:slug",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  getProductDetails,
);
route.get("/get", getAllProduct);
route.get("/:slug", getProductDetails);
route.put(
  "/update/:slug",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  activityLogger({
    action: "UPDATE_PRODUCT",
    entityType: "Product",
    getEntityName: (req) => req.params.slug,
  }),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  updateProduct,
);

route.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "Maximum 4 images allowed",
    });
  }
  next();
});

module.exports = route;
