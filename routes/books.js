var express = require('express');
var router = express.Router();
const bookProvider = require('../controllers/bookProvider');

/* GET users listing. */
router.get('/', function (req, res, next) {
  bookProvider.view(req, res);
});

router.get('/create', ((req, res) => {
  bookProvider.create(req, res);
}));

module.exports = router;
