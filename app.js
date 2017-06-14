var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');
var passport     = require('passport');

var index = require('./routes/index');
var aboutme = require('./routes/aboutme');
var myblog = require('./routes/myblog');
var myportfolio = require('./routes/myportfolio');
var contact = require('./routes/contact');

var app = express();

//Helpers

// Helpers.
var dateFormat = require('dateformat');

app.locals.date = function(date) {
	return(dateFormat(date, 'dddd d mmmm yyyy'));
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'lzxjaSFIHhwoeufhgw983roerlijsdfoi'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/aboutme', aboutme);
app.use('/myblog', myblog);
app.use('/myportfolio', myportfolio);
app.use('/contact', contact);

//app.use('/user', require('./routes/user'));

//middleware
// Middleware.
// app.use(function(request, response, next) {
//   console.log("currentUser");
//   response.locals.currentUser = request.user;
//   next();
// });




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
