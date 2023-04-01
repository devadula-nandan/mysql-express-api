// env import
require("dotenv").config();

// imports
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// cors import
var cors = require("cors");

// route imports
var index = require("./routes/index");
var users = require("./routes/users");
var posts = require("./routes/posts");

var app = express();

// cors options
const corsOptions = {
  origin: 'http://react-env.eba-g3x3jew2.ap-south-1.elasticbeanstalk.com',
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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// use cors for our app with options
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", index);

// mounting routes
app.use("/users", users);
app.use("/posts", posts);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
