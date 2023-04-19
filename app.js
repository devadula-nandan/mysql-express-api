require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Configure CORS options
const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Set up middleware
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static('./public'));

// Dynamically mount routes
const routesDir = path.join(__dirname, "routes");
fs.readdirSync(routesDir).forEach((file) => {
  const routePath = path.join(routesDir, file);
  const routeName = path.parse(file).name === "index" ? "" : path.parse(file).name;
  app.use(`/${routeName}`, require(routePath));
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;