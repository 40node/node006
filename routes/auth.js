var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  //  res.render('index', { title: 'Express' });
  res.render('login');
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/books/',
    failureRedirect: '/'
  })
);

router.get('/logout', (req, res) => {
  if (req.isAuthenticated())
    req.logout();
  res.redirect('/');
});

module.exports = router;
