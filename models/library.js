'use strict';
module.exports = (sequelize, DataTypes) => {
  var Library = sequelize.define('Library', {
    book_title: DataTypes.STRING,
    author: DataTypes.STRING,
    publisher: DataTypes.STRING,
    isbn_10: DataTypes.STRING,
    isbn_13: DataTypes.STRING,
    image_url: DataTypes.STRING(2048)
  }, {
    underscored: true,
  });
  Library.associate = function(models) {
    // associations can be defined here
  };
  return Library;
};