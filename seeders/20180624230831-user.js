'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const models = require('../models');
    return models.user.bulkCreate([
      {
        id: 1,
        email: 'tak@oshiire.to',
        password: ''
      }
    ])
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
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
