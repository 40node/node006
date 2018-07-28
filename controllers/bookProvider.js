const models = require('../models');
const libraries = models.Library;

exports.convert_parameter = (req) => {
  return req.params;
};

exports.validate = (params) => {
  let errors = params.errors = [];

  if (!params.book_title) {
    errors.push('本のタイトルが入っていません');
  }
  if (!params.image_url) {
    params.image_url = 'http://example.com/';
  }
  return errors.length === 0;
};

exports.newOne = (book) => {
  if (module.exports.validate(book)) {
    return libraries.create(book);
  } else {
    return Promise.reject(book.errors);
  }
};

exports.create = (req, res) => {
  module.exports.newOne(this.convert_parameter(req))
    .then (result => {
      res.redirect(`/books/${result.id}`);
    }).catch (errors => {
      res.render('error', {
        message: 'エラーが発生しました.',
        error: {
          status: '本を登録できませんでした.',
          stack: errors
        }
      });
    });
};