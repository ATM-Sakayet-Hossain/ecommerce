const express = require("express");
const multer = require("multer");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const {
  createReview,
  getReviews,
  getSingleReview,
  updateReview,
  getMyReviews,
  getPendingReviewProducts,
  approveReview,
  deleteReviewSoft,
  getReviewStats,
} = require("../controllers/reviewController");
const route = express.Router();
const upload = multer();

route.get("/get", getReviews);
route.get(
  "/admin/get",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  getReviews,
);
route.get(
  "/stats",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  getReviewStats,
);
route.get("/mine", authMiddleWare, getMyReviews);
route.get("/pending", authMiddleWare, getPendingReviewProducts);
route.get("/single/:reviewId", authMiddleWare, getSingleReview);
route.post(
  "/:slug",
  authMiddleWare,
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "image", maxCount: 4 },
  ]),
  createReview,
);
route.put(
  "/update/:reviewId",
  authMiddleWare,
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "image", maxCount: 4 },
  ]),
  updateReview,
);
route.patch(
  "/admin/approve/:reviewId",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  approveReview,
);
route.delete(
  "/admin/delete-soft/:reviewId",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  deleteReviewSoft,
);

module.exports = route;
