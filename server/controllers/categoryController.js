const categorySchema = require("../models/categorySchema");
const {uploadToCloudinary} = require("../services/cloudinaryService");
const { responseHandler } = require("../Utils/responseHandler");

const createCategory = async (req, res) => {
    const { name, description, sortOrder } = req.body
    const thumbnail = req.file
    try {
        if(!name) return responseHandler.error(res, 400, "Category Name is required")
        if(!thumbnail) return responseHandler.error(res, 400, "Category Picture is required")
        const slug = slugify(name, {lower: true, strict: true})
        const existingslug = await categorySchema.findOne({slug})
        if(existingslug) return responseHandler.error(res, 400, "Category already exists")
        const imgRes = await uploadToCloudinary(thumbnail, "category")
        const category = new categorySchema({
        name,
        slug,
        description,
        thumbnail: imgRes.secure_url,
        sortOrder: sortOrder || 0,
        createdBy: req.user?._id,
        updatedBy: req.user?._id
        })
        await category.save()
        responseHandler.success(res, 201, category, "Category created successfully")
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 500, "Something went wrong. Please try again later")
    }
}
const getCategory = async (req, res) => {
    try {
        const categories = await categorySchema.find({})
        responseHandler.success(res, 200, categories )
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 500, "Something went wrong. Please try again later")
    }
}
const getActiveCategory = async (req, res) => {
    try {
        const categories = await categorySchema.find({isActive: true})
        responseHandler.success(res, 200, categories )
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 500, "Something went wrong. Please try again later")
    }
}
const updateCategory = async (req, res) => {
    const { slug } = req.params
    const { name, description, sortOrder, isActive } = req.body
    const thumbnail = req.file
    try {
        const category = await categorySchema.findOne({slug})
        if(!category) return responseHandler.error(res, 400, "Category not found")
        if(name) category.name = name
        if(description) category.description = description
        if(sortOrder !== undefined ) category.sortOrder = Number(sortOrder)
        if(isActive !== undefined ) category.isActive = isActive
        if (thumbnail && category.thumbnail) {
            const publicId = category.thumbnail.split("/").pop().split(".")[0];
            await deleteFromCloudinary(`category/${publicId}`);
            const imgRes = await uploadToCloudinary(thumbnail, "category")
            category.thumbnail = imgRes.secure_url
        }
        category.updatedBy = req.user?._id
        await category.save()
        responseHandler.success(res, 200, category,  "Category updated successfully")
    } catch (error) {
        console.log(error)
        responseHandler.error(res, 500, "Something went wrong. Please try again later")
    }
}

module.exports = { createCategory, getCategory, getActiveCategory, updateCategory };
