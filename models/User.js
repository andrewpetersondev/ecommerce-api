const mongoose = require("mongoose")
const validator = require("validator")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "please provide email"],
    maxlength: 50,
    minlength: 3,
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
})

module.exports = mongoose.model("User", UserSchema)
