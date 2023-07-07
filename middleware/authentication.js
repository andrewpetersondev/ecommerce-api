const CustomError = require("../errors")
const { isTokenValid } = require("../utils")

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid")
  }

  try {
    // option 1 for payload and req.user
    // const payload = isTokenValid({ token })
    // req.user = {
    //   name: payload.name,
    //   userId: payload.userId,
    //   role: payload.role,
    // }

    // option 2 for payload and req.user
    const { name, userId, role } = isTokenValid({ token })
    req.user = { name, userId, role }

    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid")
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      )
    }
    next()
  }
}

module.exports = { authenticateUser, authorizePermissions }
