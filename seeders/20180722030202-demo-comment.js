'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const models = require('../models');
    return models.Comment.bulkCreate([
      {
        id: 1,
        comment: '#1へのコメント#1',
        book_id: 1
      },
      {
        id: 2,
        comment: '#1へのコメント#2',
        book_id: 1
      },
      {
        id: 3,
        comment: '#1へのコメント#3',
        book_id: 1
      },
      {
        id: 4,
        comment: '#2へのコメント#1',
        book_id: 2
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('comments', null, {});
  }
};
