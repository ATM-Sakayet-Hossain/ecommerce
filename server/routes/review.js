const express = require("express");
const { createReview, getReviews } = require("../controllers/reviewController");
const authMiddleWare = require("../middleware/authMiddleWare");
const route = express.Router();

route.get("/get", getReviews);
route.post("/:slug", authMiddleWare, createReview);

module.exports = route;
