var express = require('express');
var router = express.Router();

// Controller を追加
const userManager = require('../controllers/userManager');

// http://users/ へアクセスしたとき → 一覧を表示する
router.get('/', function (req, res) {
  userManager.view(req, res);
});

// http://users/100 などでアクセスしたとき → 該当のID(この場合は100)の詳細を表示する
router.get('/:id', function (req, res) {
  userManager.find(req, res);
});

// http://users/register へ POST したとき → ユーザを新たに登録する
router.post('/create', ((req, res) => {
  userManager.create(req, res);
}));

// http://users/update/100 などで POST したとき → 該当のID(この場合は100)の内容を更新する
router.post('/update/:id', ((req, res) => {
  userManager.update(req, res);
}));

// http://users/destroy/100 などでアクセスしたとき → 該当のID(この場合は100)のユーザを削除する
router.get('/destroy/:id', function (req, res) {
  userManager.destroy(req, res);
});

module.exports = router;