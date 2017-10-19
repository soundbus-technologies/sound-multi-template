var express = require('express');
var fs = require('fs');
var app = express();
var appConfig = require('./config/app.config');

require('./config/cors')(app, express);

routesFiles = fs.readdirSync(`./src/mock/router/`);
routesFiles.forEach(function (file) {
  if(file.indexOf('.js') < 0 ) return;
  require(`./router/${file}`)(app);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // log.error("Something went wrong:", err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error/error');
});

module.exports = app;
