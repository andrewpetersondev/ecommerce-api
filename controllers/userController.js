const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")

const getAllUsers = async (req, res) => {
  console.log(req.user)
  const users = await User.find({ role: "user" }).select("-password")
  res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password")
  if (!user) {
    throw new CustomError.NotFoundError(`no user with id : ${req.params.id}`)
  }
  res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
  res.send("update user")
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("please provide both values")
  }
  const user = await User.findOne({ _id: req.user.userId })
  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("invalid credentials")
  }
  user.password = newPassword

  await user.save()
  res.status(StatusCodes.OK).json({ msg: "success, password updated!" })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
