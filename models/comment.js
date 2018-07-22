'use strict';
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('Comment', {
    comment: DataTypes.TEXT,
    book_id: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Comment.associate = function(models) {
    // associations can be defined here
  };
  return Comment;
};