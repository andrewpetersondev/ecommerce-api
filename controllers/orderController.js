const Order = require("../models/Order")
const Product = require("../models/Product")

const { StatusCodes } = require("http-status-codes")
const { checkPermissions } = require("../utils")
const CustomError = require("../errors")

const createOrder = async (req, res) => {
  // console.log(req.body)
  const { items: cartItems, tax, shippingFee } = req.body
  // console.log("cartItems = ", cartItems)

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("no cart items provided")
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("please provide tax and shipping fee")
  }

  let orderItems = []
  let subtotal = 0

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new CustomError.BadRequestError(
        `product with id : ${item.product} does not exist`
      )
    }
    const { name, price, image, _id } = dbProduct
    // console.log(name, price, image)
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    }
    // add item to order
    orderItems = [...orderItems, singleOrderItem]
    // calculate subtotal
    // subtotal += item.amount * price
    subtotal = subtotal + item.amount * price

    console.log(orderItems)
    console.log(subtotal)
  }

  res.send("create order")
}

const getAllOrders = async (req, res) => {
  res.send("get all order")
}

const getSingleOrder = async (req, res) => {
  res.send("get single order")
}

const getCurrentUserOrders = async (req, res) => {
  res.send("get current user orders")
}

const updateOrder = async (req, res) => {
  res.send("update order")
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}
