const express = require("express");
const multer = require('multer');
const { createCategory, updateCategory, getAllCategory, } = require("../controllers/categoryController");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const upload = multer()
const route = express.Router();

route.post("/create", authMiddleWare, roleCheckMiddleware("admin", "editor"), upload.single("thumbnail"), createCategory);
route.get("/admin/get", authMiddleWare, roleCheckMiddleware("admin", "editor"), getAllCategory);
route.get("/get", getAllCategory);
route.put("/update/:slug", authMiddleWare, roleCheckMiddleware("admin", "editor"), upload.single("thumbnail"), updateCategory);

module.exports = route;