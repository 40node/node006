'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const models = require('../models');
    return models.user.bulkCreate([
      {
        id: 1,
        email: 'tak@oshiire.to',
        password: '$2b$10$t73WMpPlvyhkWuL.ALWe..OKbU1q1ssR4K5ezVTXLlvaDMtUuAqve',
        salt: '$2b$10$t73WMpPlvyhkWuL.ALWe..'
      },
      {
        id: 2,
        email: 'sho@oshiire.to',
        password: '$2b$10$t73WMpPlvyhkWuL.ALWe..OKbU1q1ssR4K5ezVTXLlvaDMtUuAqve',
        salt: '$2b$10$t73WMpPlvyhkWuL.ALWe..'
      },
      {
        id: 3,
        email: 'shosan@oshiire.to',
        password: '$2b$10$t73WMpPlvyhkWuL.ALWe..OKbU1q1ssR4K5ezVTXLlvaDMtUuAqve',
        salt: '$2b$10$t73WMpPlvyhkWuL.ALWe..'
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
