var express = require('express');
var router = express.Router();

// Controller を追加
const bookProvider = require('../controllers/bookProvider');

// http://books/ へアクセスしたとき → 一覧を表示する
router.get('/', function (req, res) {
  bookProvider.view(req, res);
});

// http://books/100 などでアクセスしたとき → 該当のID(この場合は100)の詳細を表示する
router.get('/:id', function (req, res) {
  bookProvider.find(req, res);
});

// http://books/create へ POST したとき → 本を新たに登録する
router.post('/create', ((req, res) => {
  bookProvider.create(req, res);
}));

// http://books/update/100 などで POST したとき → 該当のID(この場合は100)の内容を更新する
router.post('/update/:id', ((req, res) => {
  bookProvider.update(req, res);
}));

// http://books/destroy/100 などでアクセスしたとき → 該当のID(この場合は100)の本を削除する
router.get('/destroy/:id', function (req, res) {
  bookProvider.destroy(req, res);
});

module.exports = router;