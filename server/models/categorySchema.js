const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug:{
        type: String,
        
        required: true,
        unique: true
    },
    thumbnail: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
      type: Number,
      default: 0, // for UI ordering
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
}, {timestamps: true})

module.exports = mongoose.model("category", categorySchema);