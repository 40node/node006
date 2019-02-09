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
        res
          .status(200)
          // todo: add more security options and secured key.
          .json({ 'token': jwt.sign({ 'id': user.id }, 'testkey') });
      }
    });
});

module.exports = router;
