const categorySchema = require("../models/categorySchema");
const productSchema = require("../models/productSchema");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");
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
    const existslug = await productSchema.findOne({ slug: slug.toLowerCase() });
    if (existslug) return responseHandler(res, "slug already Exist");
    if (!description)
      return responseHandler(res, "Product description is required");
    if (!category) return responseHandler(res, "Product category is required");
    const categoryName =
      typeof category === "string" ? category : category.name;
    const isCategoryExist = await categorySchema.findOne({
      name: categoryName,
    });
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
    if (new Set(sku).size !== sku.length)
      return responseHandler(res, "SKU must be unique");
    if (!thumbnail)
      return responseHandler(res, "Product Thumbnail is required");
    if (images && images.length > 4)
      return responseHandler(res, "You can upload images max 4");
    const thumbnailUrl = await uploadToCloudinary(thumbnail, "products");
    let imagesUrl = [];
    if (images) {
      const resPromise = images.map(async (i) =>
        uploadToCloudinary(i, "products"),
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
      category: isCategoryExist._id,
      price,
      discountPercentage,
      variants: variatData,
      thumbnail: thumbnailUrl.secure_url,
      images: imagesUrl,
      tags,
      isActive,
    });
    await newProduct.save();
    responseHandlerSuccess(res, "Product created sucessfully", 201);
  } catch (error) {
    console.log(error);
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
        $match: {
          isActive: true,
        },
      },
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
    ];
    if (category) {
      pipeline.push({
        $match: {
          "category.slug": category,
        },
      });
    }
    const productList = await productSchema.aggregate(pipeline);
    const totalPages = Math.ceil(totalProducts / limit);
    responseHandlerSuccess(res, "", {
      product: productList,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};
const getProductDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const productDetails = await productSchema
      .findOne({ slug, isActive: true })
      .populate("category", "name")
      .select("-isActive -updatedAt -__v");
    if (!productDetails)
      return responseHandler(res, "Product is not Found", 404);
    return responseHandlerSuccess(
      res,
      "Product Details Fetched Successfully",
      productDetails,
    );
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};
const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      discountPercentage,
      variants,
      tags,
      isActive,
      destroyImages = [],
    } = req.body;
    const { slug } = req.params;
    const thumbnail = req.files?.thumbnail?.[0];
    const images = req.files?.images || [];
    const productData = await productSchema.findOne({
      slug: slug.toLowerCase(),
    });
    if (title) productData.title = title;
    if (description) productData.description = description;
    if (category) productData.category = category;
    if (price) productData.price = price;
    if (Array.isArray(tags)) productData.tags = tags;
    if (discountPercentage) productData.discountPercentage = discountPercentage;
    if (isActive) productData.isActive = isActive;
    const variantData = variants && JSON.parse(variants);
    if (Array.isArray(variantData) && variantData.length > 0) {
      for (const variant of variantData) {
        if (!variant.sku) return responseHandler(res, "Sku is required");
        if (!variant.color) return responseHandler(res, "Color is required");
        if (!variant.size) return responseHandler(res, "Size is required");
        if (!SIZE_ENUM.includes(variant.size))
          return responseHandler(res, "Incalid Size");
        if (!variant.stock || variant.stock < 1)
          return responseHandler(
            res,
            "Stock is required and must be more then 0",
          );
      }
      const sku = variantData.map((v) => v.sku);
      if (new Set(sku).size !== sku.length)
        return responseHandler(res, "SUK must unique");
      productData.variants = variantData;
    }
    if (thumbnail) {
      const imgPublicId = productData.thumbnail.split("/").pop().split(".")[0];
      deleteFromCloudinary(`products/${imgPublicId}`);
      const imgRes = await uploadToCloudinary(thumbnail, "products");
      productData.thumbnail = imgRes.secure_url;
    }
    let imagesUrl = [];
    let totalImges = productData.images.length;
    if (destroyImages.length > 0) totalImges -= destroyImages.length;
    if (Array.isArray(images) && images.length > 0) totalImges += images.length;
    if (totalImges > 4)
      return responseHandler(res, "You can upload maximum 4 images");
    if (totalImges < 1)
      return responseHandler(res, "Minimum 1 images should be stay");
    if (images) {
      const resPromise = images.map(async (i) =>
        uploadToCloudinary(i, "products"),
      );
      const results = await Promise.all(resPromise);
      imagesUrl = results.map((r) => r.secure_url);
    }
    if (Array.isArray(destroyImages) && destroyImages.length > 0) {
      for (const url of destroyImages) {
        const imgPublicId = productData.thumbnail
          .split("/")
          .pop()
          .split(".")[0];
        deleteFromCloudinary(`products/${imgPublicId}`);
      }
    }
    let filterImage = productData.images.filter((i) => {
      return !destroyImages.includes(i);
    });
    imagesUrl = imagesUrl.concat(filterImage);
    if (imagesUrl.length > 0) productData.images = imagesUrl;
    productData.save()
    responseHandlerSuccess(res, "Product Updated Successfully", productData);
  } catch (error) {
    console.log(error);
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductDetails,
  updateProduct,
};
