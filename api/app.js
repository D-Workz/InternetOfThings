const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('config');
const fs = require('fs');

mongoose.connect(config.get("mongo_url"), {useNewUrlParser: true}, function (err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});
const Promise = require('bluebird');
mongoose.Promise = Promise;
const modelPath = path.join(__dirname, 'model');
fs.readdirSync(modelPath).forEach(function (file) {
    require("./model/" + file);
});
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const usersRouter = require('./routes/sensor');
app.use('/upload', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
