const categorySchema = require("../models/categorySchema");
const {uploadToCloudinary} = require("../services/cloudinaryService");
const { responseHandler } = require("../Utils/responseHandler");

const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const thumbnail = req.file;
    if (!name) return responseHandler.error(res, 400, "Category Name is Required");
    if (!slug) return responseHandler.error(res, 400, "Category Slug is Required");
    if (!thumbnail) return responseHandler.error(res, 400, "Picture is Required");
    const existingName = await categorySchema.findOne({name});
    if(existingName) return responseHandler.error(res, 400, "Category name must be unique");
    const imgRes = await uploadToCloudinary(thumbnail, "category")

    const category = categorySchema({
        name,
        slug,
        description,
        thumbnail: imgRes.secure_url,
    })
    category.save()
    responseHandler.success(res, 201, category, "Category created successfully");
  } catch (error) {
    responseHandler.error(res, 500, "Something went wrong. Please try again later");
  }
};
const getAllCategory =async (req, res) => {
    try {
        const categoris = await categorySchema.find({});
        responseHandler.success(res, 200, categoris);
    } catch (error) {
        responseHandler.error(res, 500, "Something went wrong. Please try again later");
    }
}

module.exports = { createCategory, getAllCategory };
