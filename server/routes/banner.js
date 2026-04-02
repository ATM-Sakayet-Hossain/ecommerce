const express = require('express')
const multer = require('multer')
const authMiddleWare = require('../middleware/authMiddleWare');
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware');
const { createBanner, getAllBanners, getActiveBanners, updateBanner, deleteBanner } = require('../controllers/bannerController');
const upload = multer()
const route = express.Router()

route.post("/create", authMiddleWare, roleCheckMiddleware("admin", "editor"), upload.single("image"), createBanner);
route.get("/get-adm", authMiddleWare, roleCheckMiddleware("admin", "editor"), getAllBanners);
route.get("/get", getActiveBanners);
route.put("/update/:id", authMiddleWare, roleCheckMiddleware("admin", "editor"), upload.single("image"), updateBanner);
route.delete("/:id", authMiddleWare, roleCheckMiddleware("admin", "editor"), upload.single("image"), deleteBanner);

module.exports = route
