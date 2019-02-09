var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const models = require('../models'),
  User = models.user;

// パスワードハッシュ化
const hashPassword = (password, salt) => {
  if (password) {
    var bcrypt = require('bcrypt');
    return bcrypt.hashSync(password, salt);
  } else { return null; }
};

router.post('/', (req, res) => {
  const username = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email: username } })
    .then(user => {
      if (!user) {
        res
          .status(401)
          .json({ errors: { message: 'Incorrect email.' } });
      } else if (hashPassword(password, user.salt) !== user.password) {
        res
          .status(401)
          .json({ errors: { message: 'Incorrect password.' } });
      } else {
        const opts = {
          issuer: 'accounts.example.co.jp',
          audience: 'https://node40-node006.herokuapp.com/',
          expiresIn: '1h',
        };
        res
          .status(200)
          .json({ 'token': jwt.sign({ id: user.id }, 'testkey', opts) });
      }
    });
});

module.exports = router;
