const bannerSchema = require("../model/bannerSchema");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");
const { getPagination } = require("../services/helper");
const {
  parseDateOrNull,
  validateDateRange,
} = require("../services/validation");
const { responseHandler } = require("../Utils/responseHandler");

const createBanner = async (req, res) => {
  const { title, subtitle, startDate, endDate } = req.body;
  const image = req.file;
  try {
    if (!title) return responseHandler.error(res, 400, "Title is required");
    if (!image)
      return responseHandler.error(res, 400, "Banner Image is required");
    const start = parseDateOrNull(startDate);
    const end = parseDateOrNull(endDate);
    if (start === undefined)
      return responseHandler.error(res, 400, "Invalid startDate");
    if (end === undefined)
      return responseHandler.error(res, 400, "Invalid endDate");
    const rangeError = validateDateRange(start, end);
    if (rangeError) return responseHandler.error(res, 400, rangeError);
    const bannerImg = await uploadToCloudinary(image, "banner");
    const banner = await bannerSchema({
      title,
      subtitle,
      image: bannerImg.secure_url,
      startDate: start,
      endDate: end,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });
    await banner.save();
    responseHandler.success(res, 201, "Banner created successfully");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const getAllBanners = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const userRole = req.user?.role;
    let matchStage = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    };
    const isAdmin = userRole === "admin" || userRole === "editor";
    if (isAdmin) {
      matchStage = {};
    }
    const result = await bannerSchema.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    const banners = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;
    responseHandler.success(
      res,
      200,
      {
        banners,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      "All banners fetched",
    );
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const updateBanner = async (req, res) => {
  const id = req.params.id;
  const { title, subtitle, isActive, startDate, endDate } = req.body;
  const image = req.file;
  try {
    const existingBanner = await bannerSchema.findById(id);
    if (!existingBanner)
      return responseHandler.error(res, 404, "Banner not found");
    if (title) existingBanner.title = title;
    if (subtitle) existingBanner.subtitle = subtitle;
    if (isActive !== undefined) existingBanner.isActive = isActive;
    if (startDate !== undefined)
      existingBanner.startDate = parseDateOrNull(startDate);
    if (endDate !== undefined)
      existingBanner.endDate = parseDateOrNull(endDate);
    const rangeError = validateDateRange(startDate, endDate);
    if (rangeError) return responseHandler.error(res, 400, rangeError);
    if (image && existingBanner.image) {
      const publicId = existingBanner.image.split("/").pop().split(".")[0];
      await deleteFromCloudinary(`banner/${publicId}`);
      const imgRes = await uploadToCloudinary(image, "banner");
      existingBanner.image = imgRes.secure_url;
    }
    existingBanner.updatedBy = req.user?._id;
    await existingBanner.save();
    responseHandler.success(res, 200, "Banner updated successfully");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const deleteBanner = async (req, res) => {
  const id = req.params.id;
  try {
    const existingBanner = await bannerSchema.findByIdAndDelete(id);
    if (!existingBanner)
      return responseHandler.error(res, 404, "Banner not found");
    const publicId = existingBanner.image.split("/").pop().split(".")[0];
    await deleteFromCloudinary(`banner/${publicId}`);
    responseHandler.success(res, 200, "Banner deleted successfully");
  } catch (error) {
    console.log(error);
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

module.exports = {
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
};
