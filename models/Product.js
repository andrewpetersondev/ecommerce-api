const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a product name"],
      trim: true,
      maxlength: [100, "name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "please provide a product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "please provide a product description"],
      trim: true,
      maxlength: [1000, "description cannot be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "please provide a product category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "please provide a product company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
  // match: { rating: 5 }, // in postman, for the "get single product" call, this will limit reviews with a rating of 5, video 324
})

module.exports = mongoose.model("Product", ProductSchema)
