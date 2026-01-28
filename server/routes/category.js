const express = require("express");
const multer = require('multer');
const { createCategory, getAllCategory } = require("../controllers/categoryController");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const upload = multer()
const route = express.Router();

route.post("/createCategory", authMiddleWare, roleCheckMiddleware("admin"),upload.single("thumbnail"), createCategory)
route.get("/getAll", getAllCategory)


module.exports = route;