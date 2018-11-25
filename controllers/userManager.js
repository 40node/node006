// model 情報の読み込み
const models = require('../models');
const users = models.user;
const libraries = models.Library;
var bcrypt = require('bcrypt');

// パスワードハッシュ化
const hashPassword = (password, salt) => {
  var hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

// すべての関数をテスト利用できるように exports 対象とする
module.exports = {

  // ユーザー情報を取得する
  get_user: function (user_id) {
    return users.findOne({
      where: {
        id: user_id
      },
      include: [{
        model: libraries,
        required: false
      }]
    });
  },
  // 1冊の本の詳細を表示する
  find: function (req, res) {
    module.exports.get_user(req.params.id)
      .then(result => {
        res.render('user_view', {
          users: [result]
        });
      }).catch(() => {
        res.render('error', {
          message: 'エラーが発生しました.',
          error: {
            status: 'ユーザがいませんでした.',
          }
        });
      });
  },

  // 登録されている本の一覧と、コメント数を取得する
  get_contents: function () {
    return users.findAll({
      attributes: ['id', 'email', 'password'],
      group: ['user.id'],
      raw: true,
      subQuery: false,
      limit: 10,
      include: {
        model: libraries,
        attributes: []
      },
    });
  },
  // 登録されている本の一覧を表示する
  view: function (req, res) {
    module.exports.get_contents()
      .then(results => {
        res.render('user_view', {
          users: results
        });
      });
  },

  // パラメータが正しいかどうか検査する
  validate: function (params) {
    let errors = params.errors = [];

    if (!params.email) {
      errors.push('ユーザー名が入っていません');
    }
    if (!params.password) {
      errors.push('パスワードが入っていません');
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        params.password = hashPassword(params.password, salt);
        params.salt = salt;
      });
    }
    return errors.length === 0;
  },

  // 本を一冊登録する
  register_user: function (user) {
    return module.exports.validate(user) ? users.create(user) : Promise.reject(user.errors);
  },
  // 本を登録し、その結果を表示する
  create: function (req, res) {
    module.exports.register_user(req.body)
      .then(result => {
        res.redirect(`/users/${result.id}`);
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
  update_user: function (id, user) {
    if (module.exports.validate(user)) {
      return users.update(user, {
        where: {
          id: id
        }
      });
    } else {
      return Promise.reject(user.errors);
    }
  },
  // 本の情報を更新し、その結果を表示する
  update: function (req, res) {
    module.exports.update_user(req.params.id, req.body)
      .then(() => {
        res.redirect(`/users/${req.params.id}`);
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
  remove_user: function (id) {
    return users.destroy({
      where: {
        id: id
      }
    });
  },
  // 該当の本を削除し、その結果を表示する
  destroy: function (req, res) {
    module.exports.remove_user(req.params.id)
      .then(() => {
        res.redirect('/users/');
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
