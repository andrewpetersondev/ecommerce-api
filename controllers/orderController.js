const Order = require("../models/Order")
const Product = require("../models/Product")

const { StatusCodes } = require("http-status-codes")
const { checkPermissions } = require("../utils")
const CustomError = require("../errors")

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue"
  return { client_secret, amount }
}

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body
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
    orderItems = [...orderItems, singleOrderItem]
    subtotal = subtotal + item.amount * price
    // console.log(orderItems)
    // console.log(subtotal)
  }
  const total = tax + shippingFee + subtotal
  // get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  })

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
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
