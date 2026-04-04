const productSchema = require("../models/productSchema");
const { responseHandler } = require("../utils/responseHandler");
const reviewSchema = require("../models/reviewSchema");
const { uploadToCloudinary } = require("../services/cloudinaryService");

const createReview = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rating, comment } = req.body;
    const user = req.user?._id;
    const images = req.file;

    if (!user) return responseHandler.error(res, 401, "Unauthorized");
    if (!slug) return responseHandler.error(res, 400, "Invalid product");
    if (!rating) return responseHandler.error(res, 400, "Rating is required");
    if (rating < 1 || rating > 5 ) return responseHandler.error(res, 400, "Rating must be between 1 to 5");
    const product = await productSchema.findOne({slug: slug.toLowerCase()})
    if(!product) return responseHandler.error(res, 404, "invalid product")
    const hasPurchased = await ordersSchema.findOne({user, "items.product": slug, status: "delivered"})
    if(!hasPurchased) return responseHandler.error(res, 403, "You can only review products after delivery" )
    const existingReview = await reviewSchema.findOne({ user, slug })
    if(existingReview) return responseHandler.error(res, 400, "You already reviewed this product" )
    let imageUrl = []
    if (images) {
      const resPromise = images.map(async (i) =>
        uploadToCloudinary(images, "reviews"),
      );
      const result = await Promise.all(resPromise);
      imageUrl = result.map((r) => r.secure_url);
    }
    const review = await reviewSchema({
        user,
        product,
        rating,
        comment,
        images: imageUrl
    })
    await review.save()
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

    await productSchema.findByIdAndUpdate(productId, {
      ratings: stats[0]?.avgRating || rating,
      numOfReviews: stats[0]?.totalReviews || 1,
    });
    responseHandler.success(res, 201, review, "Review added successfully")
  } catch (error) {
    console.log(error);
    return responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};

module.exports = { createReview }