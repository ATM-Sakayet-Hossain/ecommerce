const slugify = require("slugify");
const categorySchema = require("../models/categorySchema");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");
const { responseHandler } = require("../Utils/responseHandler");
const { getPagination } = require("../services/helper");

const createCategory = async (req, res) => {
  const { name, description, sortOrder } = req.body;
  const thumbnail = req.file;
  try {
    if (!name)
      return responseHandler.error(res, 400, "Category Name is required");
    if (!thumbnail)
      return responseHandler.error(res, 400, "Category Picture is required");
    const slug = slugify(name, { lower: true, strict: true });
    const existingslug = await categorySchema.findOne({ slug });
    if (existingslug)
      return responseHandler.error(res, 400, "Category already exists");
    const imgRes = await uploadToCloudinary(thumbnail, "category");
    const category = new categorySchema({
      name,
      slug,
      description,
      thumbnail: imgRes.secure_url,
      sortOrder: sortOrder || 0,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });
    await category.save();
    responseHandler.success(res, 201, "Category created successfully");
  } catch (error) {
    console.log(error);
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const getAllCategory = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const userRole = req.user?.role;
    let matchCategory = { isActive: true };
    const isAdmin = userRole === "admin" || userRole === "editor";
    if (isAdmin) {
      matchCategory = {};
    }
    const result = await categorySchema.aggregate([
      { $match: matchCategory },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    const categories = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;
    responseHandler.success(
      res,
      200,
      {
        categories,
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
    console.log(error);
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const updateCategory = async (req, res) => {
  const { slug } = req.params;
  const { name, description, sortOrder, isActive } = req.body;
  const thumbnail = req.file;
  try {
    const category = await categorySchema.findOne({ slug });
    if (!category) return responseHandler.error(res, 400, "Category not found");
    if (name) category.name = name;
    if (description) category.description = description;
    if (sortOrder !== undefined) category.sortOrder = Number(sortOrder);
    if (isActive !== undefined) category.isActive = isActive;
    if (thumbnail && category.thumbnail) {
      const publicId = category.thumbnail.split("/").pop().split(".")[0];
      await deleteFromCloudinary(`category/${publicId}`);
      const imgRes = await uploadToCloudinary(thumbnail, "category");
      category.thumbnail = imgRes.secure_url;
    }
    category.updatedBy = req.user?._id;
    await category.save();
    responseHandler.success(res, 200, "Category updated successfully");
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
  createCategory,
  getAllCategory,
  updateCategory,
};
