var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const models = require('../models'),
  User = models.user;

var app = express();
// JWT環境変数の取り込み
require('dotenv').config({
  path: '../config/environments/.env.' + app.get('env')
});

// パスワードハッシュ化
const hashPassword = (password, salt) => {
  if (password) {
    var bcrypt = require('bcrypt');
    return bcrypt.hashSync(password, salt);
  } else { return null; }
};

// ログイン処理
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
          issuer: process.env.ISSUER,
          audience: process.env.AUDIENCE,
          expiresIn: process.env.EXPIRES,
        };
        const secret = process.env.SECRET;
        res
          .status(200)
          .json({ 'token': jwt.sign({ id: user.id }, secret, opts) });
      }
    });
});

module.exports = router;
