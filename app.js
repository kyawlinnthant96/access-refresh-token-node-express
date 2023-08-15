const express = require("express");
const logger = require("morgan");

const authRouter = require("./routes/authRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

app.use(express.json());

app.use("/api/v1/auth", authRouter);

module.exports = app;
