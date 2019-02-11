var express = require('express');
var router = express.Router();

// Controller を追加
const bookProvider = require('../controllers/bookProvider');
let book;

router.use((req, res, next) => {
  book = new bookProvider(req.user.id);
  next();
});

// http://api/books/ へアクセスしたとき → 一覧を表示する
router.get('/', (req, res) => {
  book.view(req, res);
});

// http://api/books/100 などでアクセスしたとき → 該当のID(この場合は100)の詳細を表示する
router.get('/:id', (req, res) => {
  book.find(req, res);
});

// http://api/books/ へ POST したとき → 本を新たに登録する
router.post('/', (req, res) => {
  book.create(req, res);
});

// http://api/books/100 などで PUT したとき → 該当のID(この場合は100)の内容を更新する
router.put('/:id', (req, res) => {
  book.update(req, res);
});

// http://api/books/100 などで DELETE アクセスしたとき → 該当のID(この場合は100)の本を削除する
router.delete('/:id', (req, res) => {
  book.destroy(req, res);
});

module.exports = router;