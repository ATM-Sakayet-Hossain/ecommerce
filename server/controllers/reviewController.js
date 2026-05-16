const productSchema = require("../models/productSchema");
const ordersSchema = require("../models/ordersSchema");
const { responseHandler } = require("../Utils/responseHandler");
const reviewSchema = require("../models/reviewSchema");
const { uploadToCloudinary } = require("../services/cloudinaryService");

const getReviews = async (req, res) => {
  try {
    const { slug, product, limit = 50 } = req.query;
    const query = {};

    if (slug) {
      query.slug = String(slug).toLowerCase();
    }

    if (product) {
      query.product = product;
    }

    const reviews = await reviewSchema
      .find(query)
      .populate("user", "fullName email avatar")
      .populate("product", "title slug thumbnail")
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 50)
      .lean();

    return responseHandler.success(
      res,
      200,
      {
        reviews,
        total: reviews.length,
      },
      "Reviews fetched successfully",
    );
  } catch (error) {
    console.log(error);
    return responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

const createReview = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rating, comment } = req.body;
    const user = req.user?._id;
    const images = req.files?.images || req.files?.image || [];

    if (!user) return responseHandler.error(res, 401, "Unauthorized");
    if (!slug) return responseHandler.error(res, 400, "Invalid product");
    if (!rating) return responseHandler.error(res, 400, "Rating is required");
    if (rating < 1 || rating > 5)
      return responseHandler.error(res, 400, "Rating must be between 1 to 5");
    const product = await productSchema.findOne({ slug: slug.toLowerCase() });
    if (!product) return responseHandler.error(res, 404, "invalid product");
    const hasPurchased = await ordersSchema.findOne({
      user,
      "items.product": product._id,
      status: "delivered",
    });
    if (!hasPurchased)
      return responseHandler.error(
        res,
        403,
        "You can only review products after delivery",
      );
    const existingReview = await reviewSchema.findOne({
      user,
      product: product._id,
    });
    if (existingReview)
      return responseHandler.error(
        res,
        400,
        "You already reviewed this product",
      );
    let imageUrl = [];
    if (Array.isArray(images) && images.length > 0) {
      const resPromise = images.map(async (image) =>
        uploadToCloudinary(image, "reviews"),
      );
      const result = await Promise.all(resPromise);
      imageUrl = result.map((r) => r.secure_url);
    }
    const review = await reviewSchema.create({
      user,
      product: product._id,
      slug: product.slug,
      rating,
      comment,
      images: imageUrl,
      isApproved: true,
      approvedAt: new Date(),
    });
    const stats = await reviewSchema.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    await productSchema.findByIdAndUpdate(product._id, {
      ratings: {
        average: stats[0]?.avgRating || Number(rating),
        count: stats[0]?.totalReviews || 1,
      },
    });
    responseHandler.success(res, 201, review, "Review added successfully");
  } catch (error) {
    console.log(error);
    return responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

module.exports = { createReview, getReviews };
