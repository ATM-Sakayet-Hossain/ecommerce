const mongoose = require("mongoose");
const productSchema = require("../models/productSchema");
const ordersSchema = require("../models/ordersSchema");
const reviewSchema = require("../models/reviewSchema");
const { responseHandler } = require("../Utils/responseHandler");
const { uploadToCloudinary } = require("../services/cloudinaryService");

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
const STAFF_ROLES = ["admin", "editor"];

const isStaffRole = (role) => STAFF_ROLES.includes(role);

const reviewPopulate = [
  { path: "user", select: "fullName email avatar role" },
  { path: "product", select: "title slug thumbnail ratings" },
];

const uploadReviewImages = async (images = []) => {
  if (!Array.isArray(images) || images.length === 0) {
    return [];
  }

  const uploads = images.map(async (image) =>
    uploadToCloudinary(image, "reviews"),
  );
  const results = await Promise.all(uploads);
  return results.map((result) => result.secure_url);
};

const recalculateProductRatings = async (productId) => {
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return;
  }

  const [stats] = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        isApproved: true,
        isDeleted: { $ne: true },
      },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await productSchema.findByIdAndUpdate(productId, {
    ratings: {
      average: stats?.avgRating || 0,
      count: stats?.totalReviews || 0,
    },
  });
};

const getReviews = async (req, res) => {
  try {
    const { slug, product, status, limit = 50 } = req.query;
    const query = {
      isDeleted: { $ne: true },
    };

    if (!isStaffRole(req.user?.role)) {
      query.isApproved = true;
    } else if (status) {
      const normalizedStatus = String(status).toLowerCase();
      if (normalizedStatus === "approved") {
        query.isApproved = true;
      } else if (normalizedStatus === "pending") {
        query.isApproved = false;
      } else if (normalizedStatus === "deleted") {
        query.isDeleted = true;
      }
    }

    if (slug) {
      query.slug = String(slug).toLowerCase();
    }

    if (product) {
      if (mongoose.Types.ObjectId.isValid(product)) {
        query.product = product;
      } else {
        query.slug = String(product).toLowerCase();
      }
    }

    const reviews = await Review.find(query)
      .populate(reviewPopulate)
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 50)
      .lean();
    const total = await Review.countDocuments(query);

    return responseHandler.success(
      res,
      200,
      {
        reviews,
        total,
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

    const parsedRating = Number(rating);
    if (
      rating === undefined ||
      rating === null ||
      rating === "" ||
      Number.isNaN(parsedRating)
    ) {
      return responseHandler.error(res, 400, "Rating is required");
    }
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return responseHandler.error(res, 400, "Rating must be between 1 to 5");
    }

    const product = await productSchema.findOne({ slug: slug.toLowerCase() });
    if (!product) return responseHandler.error(res, 404, "invalid product");

    const hasPurchased = await ordersSchema.findOne({
      user,
      "items.product": product._id,
      $or: [
        { status: "delivered" },
        {
          status: { $in: ["confirmed", "shipped", "delivered"] },
          "payment.status": "paid",
        },
        {
          status: { $in: ["confirmed", "shipped", "delivered"] },
          "payment.method": "cash",
        },
      ],
    });
    if (!hasPurchased) {
      return responseHandler.error(
        res,
        403,
        "You can only review products you have purchased and received",
      );
    }

    const existingReview = await Review.findOne({
      user,
      product: product._id,
      isDeleted: { $ne: true },
    });
    if (existingReview) {
      return responseHandler.error(
        res,
        400,
        "You already reviewed this product",
      );
    }

    const imageUrl = await uploadReviewImages(images);
    const review = await Review.create({
      user,
      product: product._id,
      slug: product.slug,
      rating: parsedRating,
      comment,
      images: imageUrl,
      isApproved: false,
      approvedAt: null,
      approvedBy: null,
    });

    const populatedReview = await Review.findById(review._id).populate(
      reviewPopulate,
    );

    return responseHandler.success(
      res,
      201,
      populatedReview,
      "Review added successfully",
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

const getSingleReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return responseHandler.error(res, 400, "Invalid review");
    }

    const review = await Review.findById(reviewId).populate(reviewPopulate);
    if (!review || review.isDeleted) {
      return responseHandler.error(res, 404, "Review not found");
    }

    const requesterId = req.user?._id ? String(req.user._id) : null;
    const ownerId = review.user?._id
      ? String(review.user._id)
      : String(review.user);
    if (!isStaffRole(req.user?.role) && review.isApproved !== true) {
      if (!requesterId || requesterId !== ownerId) {
        return responseHandler.error(res, 404, "Review not found");
      }
    }

    return responseHandler.success(
      res,
      200,
      review,
      "Review fetched successfully",
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

const getPendingReviewProducts = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return responseHandler.error(res, 401, "Unauthorized");

    const reviewedProductIds = await Review.find({
      user: userId,
      isDeleted: { $ne: true },
    }).distinct("product");

    const reviewedSet = new Set(reviewedProductIds.map(String));

    const orders = await ordersSchema
      .find({
        user: userId,
        $or: [
          { status: "delivered" },
          {
            status: { $in: ["confirmed", "shipped", "delivered"] },
            "payment.status": "paid",
          },
          {
            status: { $in: ["confirmed", "shipped", "delivered"] },
            "payment.method": "cash",
          },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    const productIds = new Set();
    for (const order of orders) {
      for (const item of order.items || []) {
        const id = String(item.product);
        if (!reviewedSet.has(id)) {
          productIds.add(id);
        }
      }
    }

    const products = await productSchema
      .find({ _id: { $in: [...productIds] } })
      .select("title slug thumbnail variants")
      .lean();

    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const pending = [];
    const seen = new Set();
    for (const order of orders) {
      for (const item of order.items || []) {
        const id = String(item.product);
        if (reviewedSet.has(id) || seen.has(id)) continue;
        const product = productMap.get(id);
        if (!product) continue;
        seen.add(id);
        const variant = product.variants?.find((v) => v.sku === item.sku);
        pending.push({
          product: {
            _id: product._id,
            title: product.title,
            slug: product.slug,
            thumbnail: product.thumbnail,
          },
          orderNumber: order.orderNumber,
          orderStatus: order.status,
          quantity: item.quantity,
          size: variant?.size,
          sku: item.sku,
          purchasedAt: order.createdAt,
        });
      }
    }

    return responseHandler.success(
      res,
      200,
      { pending, total: pending.length },
      "Pending review products fetched successfully",
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

const getMyReviews = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return responseHandler.error(res, 401, "Unauthorized");

    const { status, limit = 50 } = req.query;
    const query = {
      user: userId,
    };

    if (String(status).toLowerCase() === "deleted") {
      query.isDeleted = true;
    } else {
      query.isDeleted = { $ne: true };
      if (String(status).toLowerCase() === "approved") {
        query.isApproved = true;
      }
      if (String(status).toLowerCase() === "pending") {
        query.isApproved = false;
      }
    }

    const reviews = await Review.find(query)
      .populate(reviewPopulate)
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 50)
      .lean();
    const total = await Review.countDocuments(query);

    return responseHandler.success(
      res,
      200,
      {
        reviews,
        total,
      },
      "My reviews fetched successfully",
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

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?._id;
    const isStaff = isStaffRole(req.user?.role);
    const images = req.files?.images || req.files?.image || [];

    if (!userId) return responseHandler.error(res, 401, "Unauthorized");
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return responseHandler.error(res, 400, "Invalid review");
    }

    const review = await Review.findById(reviewId);
    if (!review || review.isDeleted) {
      return responseHandler.error(res, 404, "Review not found");
    }

    if (!isStaff && String(review.user) !== String(userId)) {
      return responseHandler.error(
        res,
        403,
        "You can only update your own review",
      );
    }

    if (rating !== undefined) {
      const parsedRating = Number(rating);
      if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return responseHandler.error(res, 400, "Rating must be between 1 to 5");
      }
      review.rating = parsedRating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    if (Array.isArray(images) && images.length > 0) {
      review.images = await uploadReviewImages(images);
    }

    review.updatedAt = new Date();

    if (!isStaff) {
      review.isApproved = false;
      review.approvedAt = null;
      review.approvedBy = null;
    }

    await review.save();
    await recalculateProductRatings(review.product);

    const updatedReview =
      await Review.findById(reviewId).populate(reviewPopulate);

    return responseHandler.success(
      res,
      200,
      updatedReview,
      "Review updated successfully",
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

const approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return responseHandler.error(res, 400, "Invalid review");
    }

    const review = await Review.findById(reviewId);
    if (!review || review.isDeleted) {
      return responseHandler.error(res, 404, "Review not found");
    }

    review.isApproved = true;
    review.approvedAt = new Date();
    review.approvedBy = req.user?._id || null;
    review.updatedAt = new Date();

    await review.save();
    await recalculateProductRatings(review.product);

    const approvedReview =
      await Review.findById(reviewId).populate(reviewPopulate);

    return responseHandler.success(
      res,
      200,
      approvedReview,
      "Review approved successfully",
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

const deleteReviewSoft = async (req, res) => {
  try {
    const { reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return responseHandler.error(res, 400, "Invalid review");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return responseHandler.error(res, 404, "Review not found");
    }
    if (review.isDeleted) {
      return responseHandler.error(res, 400, "Review already deleted");
    }

    const wasApproved = review.isApproved === true;
    review.isDeleted = true;
    review.deletedAt = new Date();
    review.deletedBy = req.user?._id || null;
    review.isApproved = false;
    review.approvedAt = null;
    review.approvedBy = null;
    review.updatedAt = new Date();

    await review.save();
    if (wasApproved) {
      await recalculateProductRatings(review.product);
    }

    const deletedReview =
      await Review.findById(reviewId).populate(reviewPopulate);

    return responseHandler.success(
      res,
      200,
      deletedReview,
      "Review deleted successfully",
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

const getReviewStats = async (req, res) => {
  try {
    const [
      totalReviews,
      approvedReviews,
      deletedReviews,
      ratingSummary,
      ratingBreakdown,
      topProducts,
    ] = await Promise.all([
      Review.countDocuments({ isDeleted: { $ne: true } }),
      Review.countDocuments({ isDeleted: { $ne: true }, isApproved: true }),
      Review.countDocuments({ isDeleted: true }),
      Review.aggregate([
        {
          $match: {
            isDeleted: { $ne: true },
            isApproved: true,
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalRatedReviews: { $sum: 1 },
          },
        },
      ]),
      Review.aggregate([
        {
          $match: {
            isDeleted: { $ne: true },
            isApproved: true,
          },
        },
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Review.aggregate([
        {
          $match: {
            isDeleted: { $ne: true },
            isApproved: true,
          },
        },
        {
          $group: {
            _id: "$product",
            reviewCount: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
        { $sort: { reviewCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            reviewCount: 1,
            averageRating: 1,
            "product.title": 1,
            "product.slug": 1,
            "product.thumbnail": 1,
          },
        },
      ]),
    ]);

    return responseHandler.success(
      res,
      200,
      {
        summary: {
          totalReviews,
          approvedReviews,
          pendingReviews: totalReviews - approvedReviews,
          deletedReviews,
          averageRating: ratingSummary?.[0]?.averageRating || 0,
          totalRatedReviews: ratingSummary?.[0]?.totalRatedReviews || 0,
        },
        ratingBreakdown: ratingBreakdown.map((item) => ({
          rating: item._id,
          count: item.count,
        })),
        topProducts,
      },
      "Review stats fetched successfully",
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

module.exports = {
  createReview,
  getReviews,
  getSingleReview,
  updateReview,
  getMyReviews,
  getPendingReviewProducts,
  approveReview,
  deleteReviewSoft,
  getReviewStats,
};
