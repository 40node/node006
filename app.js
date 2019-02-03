var express = require('express');
var path = require('path');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var session = require('express-session');
var models = require('./models'),
  User = models.user;

const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
// const localStrategy = require('passport-local').Strategy;
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
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add initialize session and passport
// app.use(session({ secret: '40node' }));
app.use(passport.initialize());
// app.use(passport.session());

// using authentication strategy
passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
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
        return done(err);
      });
  }
));

app.use('/api/auth', auth);
app.use('/api/books', passport.authenticate('jwt', { session: false }), books);
app.use('/api/users', passport.authenticate('jwt', { session: false }), users);

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
    message: err
  });
});

module.exports = app;
