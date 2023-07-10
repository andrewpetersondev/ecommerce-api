const Review = require("../models/Review")
const Product = require("../models/Product")

const { StatusCodes } = require("http-status-codes")
const { checkPermissions } = require("../utils")
const CustomError = require("../errors")

const createReview = async (req, res) => {
  //   console.log(req.body)
  const { product: productId } = req.body

  const isValidProduct = await Product.findOne({ _id: productId })

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`no product with id : ${productId}`)
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "already submitted a review for this product"
    )
  }

  // we have middleware so we can do the following line of code
  req.body.user = req.user.userId

  const review = await Review.create(req.body)

  res.status(StatusCodes.CREATED).json({ review })
}
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
const getSingleReview = async (req, res) => {
  // variable: alias
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new CustomError.NotFoundError(`no review with id: ${reviewId}`)
  }
  res.status(StatusCodes.OK).json({ review })
}
const updateReview = async (req, res) => {
  res.send("update review")
}
const deleteReview = async (req, res) => {
  //   console.log(req.params)
  // variable: alias
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new CustomError.NotFoundError(`no review with id: ${reviewId}`)
  }
  // the check permissions is why we use .remove() instead of .findOneAndDelete() according to video 321 at 3:30
  checkPermissions(req.user, review.user)
  await review.remove()

  res.status(StatusCodes.OK).json({ msg: "success: review removed!" })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
}
