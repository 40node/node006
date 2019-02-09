var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var models = require('./models'),
  User = models.user;

const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

var auth = require('./routes/auth');
var books = require('./routes/books');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// all responses send back as application/json type
app.use((req, res, next) => {
  res.type('json');
  next();
});

// using authentication strategy
passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    issuer: 'accounts.example.co.jp',
    audience: 'https://node40-node006.herokuapp.com/',
    secretOrKey: 'testkey'
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
