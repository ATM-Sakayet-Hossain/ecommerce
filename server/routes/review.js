const express = require("express");
const { createReview } = require("../controllers/reviewController");
const authMiddleWare = require("../middleware/authMiddleWare");
const route = express.Router();

route.post("/reviews", authMiddleWare, createReview)


module.exports = route;