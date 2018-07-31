const models = require('../models');
const libraries = models.Library;
const comments = models.Comment;

module.exports = {
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
  find: function (req, res) {
    module.exports.get_book(req.params.id)
      .then(result => {
        res.render('description', {
          title: result.book_title,
          book: result
        });
      });
  },

  get_contents: function () {
    return libraries.findAll({
      limit: 10
    });
  },
  view: function (req, res) {
    module.exports.get_contents()
      .then(results => {
        res.render('view', {
          books: results
        });
      });
  },

  validate: function (params) {
    let errors = params.errors = [];

    if (!params.book_title) {
      errors.push('本のタイトルが入っていません');
    }
    params.image_url = params.image_url || 'http://example.com/';
    return errors.length === 0;
  },

  register_book: function (book) {
    if (module.exports.validate(book)) {
      return libraries.create(book);
    } else {
      return Promise.reject(book.errors);
    }
  },

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

  remove_book: function (id) {
    return libraries.destroy({
      where: {
        id: id
      }
    });
  },
  destroy: function (req, res) {
    module.exports.remove_book(req.params.id)
      .then(result => {
        res.redirect(`/books/`);
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