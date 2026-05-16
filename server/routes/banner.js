const express = require("express");
const multer = require("multer");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const { activityLogger } = require("../middleware/activityLogger");
const {
  createBanner,
  getAllBanners,
  getBannerBySlug,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");
const upload = multer();
const route = express.Router();

route.post(
  "/create",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  activityLogger({
    action: "CREATE_BANNER",
    entityType: "Banner",
    getEntityName: (req) => req.body.title,
  }),
  upload.single("image"),
  createBanner,
);
route.get(
  "/admin/get",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  getAllBanners,
);
route.get(
  "/admin/get/:slug",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  getBannerBySlug,
);
route.get("/get", getAllBanners);
route.put(
  "/update/:slug",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  activityLogger({
    action: "UPDATE_BANNER",
    entityType: "Banner",
    getEntityName: (req) => req.params.slug,
  }),
  upload.single("image"),
  updateBanner,
);
route.delete(
  "/:slug",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  activityLogger({
    action: "DELETE_BANNER",
    entityType: "Banner",
    getEntityName: (req) => req.params.slug,
  }),
  deleteBanner,
);

module.exports = route;
