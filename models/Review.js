const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "please provide a rating"],
    },
    title: {
      type: String,
      required: [true, "please provide a review title"],
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "please provide review text"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
)

// user can leave only review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

module.exports = mongoose.model("Review", ReviewSchema)
