var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var models = require('./models'),
  User = models.user;

// passport
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

// define routing table
var auth = require('./routes/auth');
var books = require('./routes/books');
var users = require('./routes/users');

var app = express();

// set up rate limiter: maximum of five requests per second on production or a handred request per second on development
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 1 * 1000, // 1 second
  max: process.env.NODE_ENV === 'production' ? 5 : 100
});

// JWT環境変数の取り込み
require('dotenv').config({
  path: './config/environments/.env.' + app.get('env')
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(limiter);

// all responses send back as application/json type
app.use((req, res, next) => {
  res.type('json');
  next();
});

// using authentication strategy
passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    issuer: process.env.ISSUER,
    audience: process.env.AUDIENCE,
    secretOrKey: process.env.SECRET
  }, (jwt_payload, done) => {
    User.findOne({ where: { id: jwt_payload.id } })
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch(err => {
        return done(err, false);
      });
  }
));

// passport-jwt: custom callback
// Tokenを持っていなかったり Invarid Token の場合、Json形式で返答しないので、カスタムコールバックで準備する必要がある
const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({ 'errors': { 'message': info || 'user unknown' } }).end();
    }
    req.user = user;
    next();
  })(req, res, next);
};

// ルーティング: 認証が必要な URI には、jwt関数コールを追記するだけで良い
app.use('/api/auth', auth);
app.use('/api/books', jwt, books);
app.use('/api/users', jwt, users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    success: false,
    errors: {
      message: err.message
    }
  });
});

module.exports = app;
