require("dotenv").config()
require("express-async-errors")

const express = require("express")
const app = express()

// rest of the packages
const morgan = require("morgan")

const connectDB = require("./db/connect")

// routers
const authRouter = require("./routes/authRoutes")

// middleware
const NotFoundMiddleWare = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

app.use(morgan("tiny"))
app.use(express.json())

app.get("/", (req, res) => {
  res.send("e-commerce api")
})

app.use("/api/v1/auth", authRouter)

app.use(NotFoundMiddleWare)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
const start = async () => {
  try {
    connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
