'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const models = require('../models');
    return models.user.bulkCreate([
      {
        id: 1,
        email: 'tak@oshiire.to',
        password: 'fc976378be5d56d2f5a80978f32ee85d42c497e11cac416752469a3ae9d52312'
      },
      {
        id: 2,
        email: 'sho@oshiire.to',
        password: 'fc976378be5d56d2f5a80978f32ee85d42c497e11cac416752469a3ae9d52312'
      },
      {
        id: 3,
        email: 'shosan@oshiire.to',
        password: 'fc976378be5d56d2f5a80978f32ee85d42c497e11cac416752469a3ae9d52312'
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
