let log = require('./libs/log')(module);
let express = require('express');
let path = require('path');
let errorHandler = require('express-error-handler');
let HttpError =require('error').HttpError;
let createError = require('http-errors');
//let ejs = require('ejs-locals');

let cookieParser = require('cookie-parser');
//let mongoose = require('mongoose');
let logger = require('morgan');


let indexRouter =require('./routes/index');
let usersRouter = require('./routes/users');

console.log("11111");
let app = express();
console.log("11111");
app.use(errorHandler());

app.use(require('middleware/sendHttpError'));

app.engine('ejs',require('ejs-locals'));

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());





app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/users', usersRouter);




app.use(function (req,res,next) {
 res.end('layout/page.ejs');
});

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  if (typeof err == 'number') { // next(404);
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {

    if (app.get('env') ==='development') {
      errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

module.exports = app;
