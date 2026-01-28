const categorySchema = require("../models/categorySchema");
const {
  responseHandler,
  responseHandlerSuccess,
} = require("../Utils/responseHandler");
const {uploadToCloudinary} = require("../services/cloudinaryService")

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const thumbnail = req.file;
    if (!name) return responseHandler(res, "Category Name is Required");
    if (!thumbnail) return responseHandler(res, "Picture is Required");
    const existingName = await categorySchema.findOne({name});
    if(existingName) return responseHandler(res, "Category name must be unique");
    const imgRes = await uploadToCloudinary(thumbnail, "category")

    const category = categorySchema({
        name,
        description,
        thumbnail: imgRes.secure_url,
    })
    category.save()
    responseHandlerSuccess(res, "Category created successfully", 201);
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};
const getAllCategory =async (req, res) => {
    try {
        const categoris = await categorySchema.find({});
        responseHandlerSuccess(res, categoris);
    } catch (error) {
        console.log(error);
        responseHandler(res, 500, "Something went wrong. Please try again later");
    }
}

module.exports = { createCategory, getAllCategory };
