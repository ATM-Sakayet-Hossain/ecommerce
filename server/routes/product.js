const express = require("express");
const multer = require('multer');
const upload = multer()
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const authMiddleWare = require("../middleware/authMiddleWare");
const route = express.Router();

route.post("/createCategory", authMiddleWare, roleCheckMiddleware("admin, editor"),upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 4 }]), createCategory)

module.exports = route;