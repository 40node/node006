// model 情報の読み込み
const models = require('../models');
const libraries = models.Library;
const comments = models.Comment;

// 1冊の本の情報を取得する
const get_book = ((user_id) => {
  return ((book_id) => {
    return libraries.findOne({
      where: {
        user_id: user_id,
        id: book_id
      },
      include: [{
        model: comments,
        required: false
      }]
    });
  });
});
// 1冊の本の詳細を表示する
exports.find = (req, res) => {
  get_book(req.user.id)(req.params.id)
    .then(result => {
      res
        .type('application/json')
        .status(200)
        .json(result.get());
    }).catch(() => {
      res
        .type('application/json')
        .status(200)
        .json({});
    });
};

// 登録されている本の一覧と、コメント数を取得する
const get_contents = user_id => {
  return libraries.findAll({
    attributes: ['id', 'book_title', 'author', 'publisher', [models.sequelize.fn('COUNT', models.sequelize.col('Comments.book_id')), 'cnt']],
    group: ['Library.id'],
    raw: true,
    subQuery: false,
    limit: 10,
    where: {
      user_id: user_id
    },
    include: {
      model: models.Comment,
      attributes: []
    },
  });
};
// 登録されている本の一覧を表示する
exports.view = (req, res) => {
  get_contents(req.user.id)
    .then(result => {
      res
        .type('application/json')
        .status(200)
        .json(result);
    }).catch(err => {
      res
        .type('application/json')
        .status(200)
        .json(err);
    });
};

// パラメータが正しいかどうか検査する
const validate = params => {
  let errors = params.errors = [];
  if (!params.book_title) {
    errors.push('本のタイトルが入っていません');
  }
  // 画像URLがなければデフォルトを登録する
  params.image_url = params.image_url || 'http://example.com/';
  return errors.length === 0;
};
// 本を一冊登録する
const register_book = book => {
  return validate(book) ? libraries.create(book) : Promise.reject(book.errors);
};
// 本を登録し、その結果を表示する
exports.create = (req, res) => {
  req.body.user_id = req.user.id;
  register_book(req.body)
    .then(result => {
      res
        .location(`/books/${result.id}`)
        .type('application/json')
        .status(201)
        .json(result.get());
    }).catch(errors => {
      res
        .type('application/json')
        .status(200)
        .json({
          message: 'エラーが発生しました.',
          error: {
            status: '本を登録できませんでした.',
            stack: errors
          }
        });
    });
};

// 対象の本の情報を更新する
const update_book = (id, book) => {
  if (validate(book)) {
    return libraries.update(book, {
      where: {
        id: id
      }
    });
  } else {
    return Promise.reject(book.errors);
  }
};
// 本の情報を更新し、その結果を表示する
exports.update = (req, res) => {
  update_book(req.params.id, req.body)
    .then(result => get_book(req.user.id)(result))
    .then(content => {
      res
        .location(`/books/${req.params.id}`)
        .type('application/json')
        .status(201)
        .json(content);
    }).catch(errors => {
      res
        .type('application/json')
        .status(200)
        .json({
          message: 'エラーが発生しました.',
          error: {
            status: '本を更新できませんでした.',
            stack: errors
          }
        });
    });
};

// 1冊の本を削除する
const remove_book = (user_id) => {
  return (id) => {
    return libraries.destroy({
      where: {
        id: id,
        user_id: user_id
      }
    });
  };
};
// 該当の本を削除し、その結果を表示する
exports.destroy = (req, res) => {
  remove_book(req.user.id)(req.params.id)
    .then(num_destroy => {
      if (num_destroy >= 1) {
        res
          .type('application/json')
          .status(204)
          .end();
      } else {
        res
          .type('application/json')
          .status(404)
          .end();
      }
    }).catch(errors => {
      res
        .type('application/json')
        .status(200)
        .json({
          success: false,
          message: '本を削除できませんでした.' + errors,
        });
    });
};