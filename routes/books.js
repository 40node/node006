var express = require('express');
var router = express.Router();
const bookProvider = require('../controllers/bookProvider');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create', ((req, res) => {
  bookProvider.create(req, res);
}));

module.exports = router;
