var express = require('express');
var router = express.Router();
const bookProvider = require('../controllers/bookProvider');

/* GET users listing. */
router.get('/', function (req, res, next) {
  bookProvider.view(req, res);
});

router.get('/:id', function (req, res, next) {
  bookProvider.find(req, res);
});

router.post('/create', ((req, res) => {
  bookProvider.create(req, res);
}));

router.post('/update/:id', ((req, res) => {
  bookProvider.update(req, res);
}));

router.get('/destroy/:id', function (req, res, next) {
  bookProvider.destroy(req, res);
});

module.exports = router;
