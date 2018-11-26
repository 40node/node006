var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// var csurf = require('csurf');
var bodyParser = require('body-parser');
var session = require('express-session');
var models = require('./models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// パスワードハッシュ化
const hashPassword = (password, salt) => {
  var bcrypt = require('bcrypt');
  var hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

var index = require('./routes/index');
var books = require('./routes/books');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(csurf({ cookie: true }));
app.use(express.static(path.join(__dirname, 'public')));

// add initialize session and passport
app.use(session({ secret: '40node' }));
app.use(passport.initialize());
app.use(passport.session());

// using authentication strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (username, password, done) => {
    models.user.findOne({ where: { email: username } }).then(user => {
      if (!user)
        return done(null, false, { message: 'Incorrect email.' });
      if (hashPassword(password, user.salt) !== user.password)
        return done(null, false, { message: 'Incorrect password.' });
      return done(null, user.get());
    }).catch(err => done(err));
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  models.user.findById(id).then(user => {
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);
    }
  });
});

// for authenticating
app.use((req, res, next) => {
  if (req.isAuthenticated())
    return next();
  switch (req.url) {
    case '/':
    case '/users/':
    case '/users/create':
    case '/login':
      next();
      break;
    default:
      res.redirect('/');
  }
});

app.use('/', index);
app.use('/books', books);
app.use('/users', users);

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
  res.render('error');
});

module.exports = app;
