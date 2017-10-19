var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var favicon = require('serve-favicon');
var path = require('path');
var isProduction = process.env.NODE_ENV === 'production';
var log4js = require('log4js');

module.exports = function (app,express) {
// app.set('views', path.join(__dirname, '/public/views'));

  app.set('view engine', 'html');
  nunjucks.configure(path.join(__dirname, '../../../public/views'), {
    autoescape: false,
    express: app,
    tags: {
      variableStart: '{$',
      variableEnd: '}',
    }
  });
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//   app.use(logger('dev'));
  app.use(log4js.connectLogger(
    log4js.getLogger("http"),
    {
      level: 'auto',
      format:':method :status :url '
    }
  ));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../../../public')));

  app.all("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With, user");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    if (req.method == 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

};