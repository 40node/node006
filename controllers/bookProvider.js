// model 情報の読み込み
const models = require('../models');
const libraries = models.Library;
const comments = models.Comment;

// すべての関数をテスト利用できるように exports 対象とする
module.exports = {

  // 1冊の本の情報を取得する  
  get_book: function (book_id) {
    return libraries.findOne({
      where: {
        id: book_id
      },
      include: [{
        model: comments,
        required: false
      }]
    });
  },
  // 1冊の本の詳細を表示する
  find: function (req, res) {
    module.exports.get_book(req.params.id)
      .then(result => {
        res.render('description', {
          title: result.book_title,
          book: result
        });
      }).catch(() => {
        res.render('error', {
          message: 'エラーが発生しました.',
          error: {
            status: '本がありませんでした.',
          }
        });
      });
  },

  // 登録されている本の一覧と、コメント数を取得する
  get_contents: function () {
    return libraries.findAll({
      attributes: ['id', 'book_title', 'author', 'publisher', [models.sequelize.fn('COUNT', models.sequelize.col('Comments.book_id')), 'cnt']],
      group: ['Library.id'],
      raw: true,
      subQuery: false,
      limit: 10,
      include: {
        model: models.Comment,
        attributes: []
      },
    });
  },
  // 登録されている本の一覧を表示する
  view: function (req, res) {
    module.exports.get_contents()
      .then(results => {
        res.render('view', {
          books: results
        });
      });
  },

  // パラメータが正しいかどうか検査する
  validate: function (params) {
    let errors = params.errors = [];

    if (!params.book_title) {
      errors.push('本のタイトルが入っていません');
    }
    // 画像URLがなければデフォルトを登録する
    params.image_url = params.image_url || 'http://example.com/';
    return errors.length === 0;
  },

  // 本を一冊登録する
  register_book: function (book) {
    return module.exports.validate(book) ? libraries.create(book) : Promise.reject(book.errors);
  },
  // 本を登録し、その結果を表示する
  create: function (req, res) {
    module.exports.register_book(req.body)
      .then(result => {
        res.redirect(`/books/${result.id}`);
      }).catch(errors => {
        res.render('error', {
          message: 'エラーが発生しました.',
          error: {
            status: '本を登録できませんでした.',
            stack: errors
          }
        });
      });
  },

  // 対象の本の情報を更新する
  update_book: function (id, book) {
    if (module.exports.validate(book)) {
      return libraries.update(book, {
        where: {
          id: id
        }
      });
    } else {
      return Promise.reject(book.errors);
    }
  },
  // 本の情報を更新し、その結果を表示する
  update: function (req, res) {
    module.exports.update_book(req.params.id, req.body)
      .then(() => {
        res.redirect(`/books/${req.params.id}`);
      }).catch(errors => {
        res.render('error', {
          message: 'エラーが発生しました.',
          error: {
            status: '本を登録できませんでした.',
            stack: errors
          }
        });
      });
  },

  // 1冊の本を削除する
  remove_book: function (id) {
    return libraries.destroy({
      where: {
        id: id
      }
    });
  },
  // 該当の本を削除し、その結果を表示する
  destroy: function (req, res) {
    module.exports.remove_book(req.params.id)
      .then(() => {
        res.redirect('/books/');
      }).catch(errors => {
        res.render('error', {
          message: 'エラーが発生しました.',
          error: {
            status: '本を削除できませんでした.',
            stack: errors
          }
        });
      });
  }
};
