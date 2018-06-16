'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    auth_hash: DataTypes.STRING
  }, {
    underscored: true,
  });
  User.associate = function(models) {
    User.hasMany(models.Library);
  };
  return User;
};