const categorySchema = require("../models/categorySchema");
const productSchema = require("../models/productSchema");
const { uploadToCloudinary } = require("../services/cloudinaryService");
const {
  responseHandler,
  responseHandlerSuccess,
} = require("../Utils/responseHandler");
const SIZE_ENUM = ["s", "m", "l", "xl", "2xl", "3xl"];

const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      category,
      price,
      discountPercentage,
      variants,
      tags,
      isActive,
    } = req.body;
    const thumbnail = req.files?.thumbnail?.[0];
    const images = req.files?.images || [];
    if (!title) return responseHandler(res, "Product title is required");
    if (!slug) return responseHandler(res, "Product slug is required");
    const existslug = await productSchema.findOne({ slud: slug.toLowerCase() });
    if (!existslug) return responseHandler(res, "slug already Exist");
    if (!description)
      return responseHandler(res, "Product description is required");
    if (!category) return responseHandler(res, "Product category is required");
    const isCategoryExist = await categorySchema.findById(category);
    if (!isCategoryExist) return responseHandler(res, "Invalid category");
    if (!price) return responseHandler(res, "Product price is required");
    const variatData = JSON.parse(variants);
    if (!Array.isArray(variatData) || variatData.length === 0)
      return responseHandler(res, "Minimum 1 variant is required.");
    for (const variant of variatData) {
      if (!variant.sku) return responseHandler(res, "Product sku is required");
      if (!variant.color)
        return responseHandler(res, "Product color is required");
      if (!variant.size)
        return responseHandler(res, "Product size is required");
      if (!SIZE_ENUM.includes(variant.size))
        return responseHandler(res, "Invalid size");
      if (!variant.stock || variant.stock < 0)
        return responseHandler(
          res,
          "Product stock is required and must be more than 0",
        );
    }
    const sku = variatData.map((v) => v.sku);
    if (new set(sku).size !== skus.length)
      return responseHandler(res, "SKU must be unique");
    if (!thumbnail)
      return responseHandler(res, "Product Thumbnail is required");
    if (images && images.length > 4)
      return responseHandler(res, "You can upload images max 4");
    let imagesUrl = [];
    if (images) {
      const resPromise = images.map(async (i) =>
        uploadToCloudinary(i, "Product"),
      );
      const result = await Promise.all(resPromise);
      imagesUrl = result.map((r) => r.secure_url);
    }
    // for (const img of images) {
    //     const result = await uploadToCloudinary(img, "Product");
    //     imagesUrl.push(result.secure_url);
    // }
    const newProduct = productSchema({
      title,
      slug: slug.toLowerCase(),
      description,
      category,
      price,
      discountPercentage,
      variants: variatData,
      thumbnail: thumbnailUrl.secure_url,
      images: imagesUrl,
      tags,
      isActive,
    });
    newProduct.save();
    responseHandlerSuccess(res, "Product created sucessfully", 201);
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};

const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.page) || 10;
    const category = req.query.category;
    const skip = (page - 1) * limit;
    const totalProducts = await productSchema.countDocuments();
    const pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]
    if(category){
      pipeline.push({
        $match: {
          "category.name": category
        }
      })
    }
    const productList = await productSchema.aggregate(pipeline)
    const totalPages = Math.ceil(totalProducts / limit)
    responseHandlerSuccess(res, "", {
      product: productList,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    })
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};

module.exports = { createProduct, getAllProduct };
