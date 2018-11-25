'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const models = require('../models');
    return models.user.bulkCreate([
      {
        id: 1,
        email: 'tak@oshiire.to',
        password: 'password'
      },
      {
        id: 2,
        email: 'sho@oshiire.to',
        password: 'password'
      },
      {
        id: 3,
        email: 'shosan@oshiire.to',
        password: 'password'
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
