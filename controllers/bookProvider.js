const models = require('../models');
const libraries = models.Library;
const comments = models.Comment;

module.exports = {
  get_book: function (id) {
    return libraries.findOne({
      where: {
        id: id
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
        res.render('description', result);
      });
  },

  get_contents: function () {
    return libraries.findAll({
      limit: 10
    });
  },
  view: function (req, res) {
    module.exports.get_contents(req.params.id)
      .then(results => {
        res.render('view', results);
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

  newOne: function (book) {
    if (module.exports.validate(book)) {
      return libraries.create(book);
    } else {
      return Promise.reject(book.errors);
    }
  },

  create: function (req, res) {
    module.exports.newOne(req.params)
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
  }

};