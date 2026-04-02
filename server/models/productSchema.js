const mongoose = require("mongoose");
const reviewSchema = require("./reviewSchema");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    brand: { type: String, default: "", index: true },
    discountPrice: { type: Number, default: 0, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    price: {
      type: Number,
      required: true,
    },
    variants: [
      {
        sku: {
          type: String,
          required: true,
          unique: true,
        },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
          enum: ["s", "m", "l", "xl", "2xl", "3xl"],
        },
        stock: {
          type: Number,
          required: true,
        },
      },
    ],
    tags: {
      type: Array,
      index: true
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    iratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    reviews: { type: [reviewSchema], default: [] },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("product", productSchema);
