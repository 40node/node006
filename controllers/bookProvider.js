// model 情報の読み込み
const models = require('../models');
const libraries = models.Library;
const comments = models.Comment;

module.exports = class bookProvider {
  constructor(user_id) {
    this._user_id = user_id;
  }

  // 1冊の本の情報を取得する
  _get_book(book_id) {
    return libraries.findOne({
      where: {
        user_id: this._user_id,
        id: book_id
      },
      include: [{
        model: comments,
        required: false
      }]
    });
  }

  // 1冊の本の詳細を表示する
  find(req, res) {
    this._get_book(req.params.id)
      .then(result => {
        res
          .status(200)
          .json(result.get());
      }).catch(() => {
        res
          .status(200)
          .json({});
      });
  }

  // 登録されている本の一覧と、コメント数を取得する
  _get_contents() {
    return libraries.findAll({
      attributes: ['id', 'book_title', 'author', 'publisher', [models.sequelize.fn('COUNT', models.sequelize.col('Comments.book_id')), 'cnt']],
      group: ['Library.id'],
      raw: true,
      subQuery: false,
      limit: 10,
      where: {
        user_id: this._user_id
      },
      include: {
        model: models.Comment,
        attributes: []
      },
    });
  }
  // 登録されている本の一覧を表示する
  view(req, res) {
    this._get_contents()
      .then(result => {
        res
          .status(200)
          .json(result);
      }).catch(err => {
        res
          .status(200)
          .json({
            errors: { message: err }
          });
      });
  }

  // パラメータが正しいかどうか検査する
  _validate(params) {
    let errors = params.errors = [];
    if (!params.book_title) {
      errors.push({ 'message': '本のタイトルが入っていません' });
    }
    // 画像URLがなければデフォルトを登録する
    params.image_url = params.image_url || 'http://example.com/';
    return errors.length === 0;
  }
  // 本を一冊登録する
  _register_book(book) {
    return this._validate(book) ? libraries.create(book) : Promise.reject(book.errors);
  }
  // ポート番号の設定
  _set_port(port) {
    return (port === 80 || port === 443) ? '' : `:${port}`;
  }
  // 本を登録し、その結果を表示する
  create(req, res) {
    req.body.user_id = this._user_id;
    this._register_book(req.body)
      .then(result => {
        res
          .location(`${req.hostname}${this._set_port(req.app.settings.port)}/api/books/${result.id}`)
          .status(201)
          .json(result.get());
      }).catch(errors => {
        res
          .status(400)
          .json({ errors: errors });
      });
  }

  // 対象の本の情報を更新する
  _update_book(id, book) {
    return libraries.update(book, {
      where: {
        user_id: this._user_id,
        id: id
      }
    });

  }
  // 本の情報を更新し、その結果を表示する
  update(req, res) {
    this._update_book(req.params.id, req.body)
      .then(() => this._get_book(req.params.id))
      .then(content => {
        res
          .location(`${req.hostname}${this._set_port(req.app.settings.port)}/api/books/${req.params.id}`)
          .status(201)
          .json(content);
      }).catch(errors => {
        res
          .status(400)
          .json({
            errors: errors
          });
      });
  }

  // 1冊の本を削除する
  _remove_book(id) {
    return libraries.destroy({
      where: {
        id: id,
        user_id: this._user_id
      }
    });
  }
  // 該当の本を削除し、その結果を表示する
  destroy(req, res) {
    this._remove_book(req.params.id)
      .then(num_destroy => {
        if (num_destroy >= 1) {
          res
            .status(204)
            .end();
        } else {
          res
            .status(404)
            .end();
        }
      }).catch(errors => {
        res
          .status(409)
          .json({ errors: { message: errors.name } });
      });
  }
};