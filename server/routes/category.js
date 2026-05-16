const express = require("express");
const multer = require("multer");
const {
  createCategory,
  updateCategory,
  getAllCategory,
  getCategoryBySlug,
} = require("../controllers/categoryController");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const { activityLogger } = require("../middleware/activityLogger");
const upload = multer();
const route = express.Router();

route.post(
  "/create",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  activityLogger({
    action: "CREATE_CATEGORY",
    entityType: "Category",
    getEntityName: (req) => req.body.name,
  }),
  upload.single("thumbnail"),
  createCategory,
);
route.get(
  "/admin/get",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  getAllCategory,
);
route.get("/public/:slug", getCategoryBySlug);
route.get(
  "/get/:slug",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  getCategoryBySlug,
);
route.get("/get", getAllCategory);
route.put(
  "/update/:slug",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  activityLogger({
    action: "UPDATE_CATEGORY",
    entityType: "Category",
    getEntityName: (req) => req.params.slug,
  }),
  upload.single("thumbnail"),
  updateCategory,
);

module.exports = route;
