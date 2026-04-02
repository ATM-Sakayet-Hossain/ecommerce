const express = require("express");
const multer = require('multer');
const { createCategory, getCategory, updateCategory, getActiveCategory } = require("../controllers/categoryController");
const authMiddleWare = require("../middleware/authMiddleWare");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const upload = multer()
const route = express.Router();

route.post("/create", authMiddleWare, roleCheckMiddleware("admin", "editor"), upload.single("thumbnail"), createCategory);
route.get("/get-adm", authMiddleWare, roleCheckMiddleware("admin", "editor"), getCategory);
route.get("/get", getActiveCategory);
route.put("/update/:slug", authMiddleWare, roleCheckMiddleware("admin", "editor"), upload.single("thumbnail"), updateCategory);


module.exports = route;