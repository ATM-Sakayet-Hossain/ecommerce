const mongoose = require("mongoose");
const slugify = require("slugify");
const categorySchema = require("../models/categorySchema");
const productSchema = require("../models/productSchema");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");
const { getPagination } = require("../services/helper");
const { responseHandler } = require("../Utils/responseHandler");
const SIZE_ENUM = ["s", "m", "l", "xl", "2xl", "3xl"];

const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug: submittedSlug,
      description,
      category,
      price,
      variants,
      brand,
      tags,
      discountPrice,
      discountPercentage,
      isActive,
    } = req.body;
    const thumbnail = req.files?.thumbnail?.[0];
    const images = req.files?.images || [];
    if (!title)
      return responseHandler.error(res, 400, "Product title is required");
    const slug = submittedSlug?.trim()
      ? slugify(submittedSlug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });
    const existslug = await productSchema.findOne({ slug: slug.toLowerCase() });
    if (existslug) return responseHandler.error(res, 400, "slug already Exist");
    if (!description)
      return responseHandler.error(res, 400, "Product description is required");
    if (!category)
      return responseHandler.error(res, 400, "Product category is required");
    const categoryQuery = mongoose.Types.ObjectId.isValid(category)
      ? { _id: category }
      : { name: category };
    const isCategoryExist = await categorySchema.findOne(categoryQuery);
    if (!isCategoryExist)
      return responseHandler.error(res, 400, "Invalid category");
    if (!price)
      return responseHandler.error(res, 400, "Product price is required");
    const variatData = Array.isArray(variants)
      ? variants
      : JSON.parse(variants || "[]");
    if (!Array.isArray(variatData) || variatData.length === 0)
      return responseHandler.error(res, 400, "Minimum 1 variant is required.");
    for (const variant of variatData) {
      if (!variant.sku)
        return responseHandler.error(res, 400, "Product sku is required");
      if (!variant.color)
        return responseHandler.error(res, 400, "Product color is required");
      if (!variant.size)
        return responseHandler.error(res, 400, "Product size is required");
      if (!SIZE_ENUM.includes(variant.size))
        return responseHandler.error(res, 400, "Invalid size");
      if (
        variant.stock === undefined ||
        variant.stock === null ||
        Number(variant.stock) < 0
      )
        return responseHandler.error(
          res,
          400,
          "Product stock is required and must be more than 0",
        );
    }
    const sku = variatData.map((v) => v.sku);
    if (new Set(sku).size !== sku.length)
      return responseHandler.error(res, 400, "SKU must be unique");
    if (!thumbnail)
      return responseHandler.error(res, 400, "Product Thumbnail is required");
    if (images && images.length > 4)
      return responseHandler.error(res, 400, "You can upload images max 4");
    const thumbnailUrl = await uploadToCloudinary(thumbnail, "products");
    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string" && tags.trim()
        ? (() => {
            try {
              const decodedTags = JSON.parse(tags);
              return Array.isArray(decodedTags)
                ? decodedTags
                : tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean);
            } catch {
              return tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);
            }
          })()
        : [];
    const parsedIsActive =
      isActive === undefined ? true : isActive === true || isActive === "true";
    const parsedDiscountPrice = Number(discountPrice || 0);
    const parsedDiscountPercentage = Number(discountPercentage || 0);
    const parsedPrice = Number(price);
    const normalizedVariants = variatData.map((variant) => ({
      ...variant,
      stock: Number(variant.stock),
    }));
    let imagesUrl = [];
    if (images) {
      const resPromise = images.map(async (images) =>
        uploadToCloudinary(images, "products"),
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
      price: parsedPrice,
      discountPercentage: parsedDiscountPercentage,
      variants: normalizedVariants,
      thumbnail: thumbnailUrl.secure_url,
      images: imagesUrl,
      tags: parsedTags,
      brand,
      discountPrice: parsedDiscountPrice,
      isActive: parsedIsActive,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });
    await newProduct.save();
    responseHandler.success(
      res,
      201,
      newProduct,
      "Product created sucessfully",
    );
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const getAllProduct = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc",
      isActive,
    } = req.query;
    const userRole = req.user?.role;
    const isAdmin = ["admin", "editor"].includes(userRole);
    const andConditions = [];
    if (!isAdmin) {
      andConditions.push({ isActive: true });
    }
    const parsedIsActive =
      isActive === "true" || isActive === true
        ? true
        : isActive === "false" || isActive === false
          ? false
          : undefined;
    if (isAdmin && parsedIsActive !== undefined) {
      andConditions.push({ isActive: parsedIsActive });
    }
    if (search) {
      andConditions.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
        ],
      });
    }
    if (minPrice != null || maxPrice != null) {
      const priceFilter = {};
      if (minPrice != null) priceFilter.$gte = Number(minPrice);
      if (maxPrice != null) priceFilter.$lte = Number(maxPrice);
      andConditions.push({ price: priceFilter });
    }
    const matchproduct =
      andConditions.length > 0 ? { $and: andConditions } : {};
    const sortOrder = order === "asc" ? 1 : -1;
    const pipeline = [
      {
        $match: matchproduct,
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      pipeline.push({
        $match: {
          "categoryData._id": new mongoose.Types.ObjectId(category),
        },
      });
    }
    pipeline.push(
      { $sort: { [sortBy]: sortOrder } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    );
    const result = await productSchema.aggregate(pipeline);
    const productList = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);
    responseHandler.success(res, 200, {
      product: productList,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.log(error);
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const getProductDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const isAdminRequest = ["admin", "editor"].includes(req.user?.role);
    const query = isAdminRequest
      ? { slug: slug.toLowerCase() }
      : { slug: slug.toLowerCase(), isActive: true };
    const productDetails = await productSchema
      .findOne(query)
      .populate("category", "name")
      .select("-isActive -updatedAt -__v");
    if (!productDetails)
      return responseHandler.error(res, 400, "Product is not Found", 404);
    return responseHandler.success(
      res,
      200,
      productDetails,
      "Product Details Fetched Successfully",
    );
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const updateProduct = async (req, res) => {
  try {
    const {
      title,
      slug: submittedSlug,
      description,
      category,
      brand,
      price,
      discountPrice,
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
    if (!productData)
      return responseHandler.error(res, 404, "Product not found");
    const nextSlug = submittedSlug?.trim()
      ? slugify(submittedSlug, { lower: true, strict: true })
      : productData.slug;
    if (nextSlug !== productData.slug) {
      const existingProduct = await productSchema.findOne({ slug: nextSlug });
      if (existingProduct)
        return responseHandler.error(res, 400, "slug already Exist");
      productData.slug = nextSlug;
    }
    if (title) productData.title = title;
    if (description) productData.description = description;
    if (category) productData.category = category;
    if (brand !== undefined) productData.brand = brand;
    if (price) productData.price = price;
    if (discountPrice !== undefined)
      productData.discountPrice = Number(discountPrice || 0);
    if (discountPercentage !== undefined)
      productData.discountPercentage = Number(discountPercentage || 0);
    if (isActive !== undefined)
      productData.isActive = isActive === true || isActive === "true";
    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string" && tags.trim()
        ? (() => {
            try {
              const decodedTags = JSON.parse(tags);
              return Array.isArray(decodedTags)
                ? decodedTags
                : tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean);
            } catch {
              return tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);
            }
          })()
        : [];
    if (parsedTags) productData.tags = parsedTags;
    const variantData =
      typeof variants === "string" ? JSON.parse(variants) : variants;
    if (Array.isArray(variantData) && variantData.length > 0) {
      for (const variant of variantData) {
        if (!variant.sku)
          return responseHandler.error(res, 400, "Sku is required");
        if (!variant.color)
          return responseHandler.error(res, 400, "Color is required");
        if (!variant.size)
          return responseHandler.error(res, 400, "Size is required");
        if (!SIZE_ENUM.includes(variant.size))
          return responseHandler.error(res, 400, "Incalid Size");
        if (Number(variant.stock) < 0)
          return responseHandler.error(
            res,
            400,
            "Stock is required and must be more then 0",
          );
      }
      const sku = variantData.map((v) => v.sku);
      if (new Set(sku).size !== sku.length)
        return responseHandler.error(res, 400, "SUK must unique");
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
    const parsedDestroyImages = Array.isArray(destroyImages)
      ? destroyImages
      : typeof destroyImages === "string" && destroyImages.trim()
        ? JSON.parse(destroyImages)
        : [];
    if (parsedDestroyImages.length > 0) totalImges -= parsedDestroyImages.length;
    if (Array.isArray(images) && images.length > 0) totalImges += images.length;
    if (totalImges > 4)
      return responseHandler.error(res, 400, "You can upload maximum 4 images");
    if (totalImges < 1)
      return responseHandler.error(res, 400, "Minimum 1 images should be stay");
    if (images) {
      const resPromise = images.map(async (i) =>
        uploadToCloudinary(i, "products"),
      );
      const results = await Promise.all(resPromise);
      imagesUrl = results.map((r) => r.secure_url);
    }
    if (Array.isArray(parsedDestroyImages) && parsedDestroyImages.length > 0) {
      for (const url of parsedDestroyImages) {
        const imgPublicId = String(url)
          .split("/")
          .pop()
          .split(".")[0];
        deleteFromCloudinary(`products/${imgPublicId}`);
      }
    }
    let filterImage = productData.images.filter((i) => {
      return !parsedDestroyImages.includes(i);
    });
    imagesUrl = imagesUrl.concat(filterImage);
    if (imagesUrl.length > 0) productData.images = imagesUrl;
    await productData.save();
    responseHandler.success(
      res,
      200,
      productData,
      "Product Updated Successfully",
    );
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductDetails,
  updateProduct,
};
