var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var models = require('../models'),
  User = models.user;

// パスワードハッシュ化
const hashPassword = (password, salt) => {
  if (password) {
    var bcrypt = require('bcrypt');
    return bcrypt.hashSync(password, salt);
  } else { return null; }
};

router.post('/', (req, res, next) => {
  const username = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email: username } })
    .then(user => {
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: 'Incorrect email.' });
      } else if (hashPassword(password, user.salt) !== user.password) {
        res
          .status(401)
          .json({ success: false, message: 'Incorrect password.' });
      } else {
        res
          .status(200)
          .json({ success: true, token: jwt.sign(user.get(), 'testkey'), message: 'success' });
      }
    });
});

router.get('/logout', (req, res) => {
  if (req.isAuthenticated())
    req.logout();
  res.redirect('/');
});

module.exports = router;
