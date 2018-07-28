'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const models = require('../models');
    return models.Library.bulkCreate([
      {
        id: 1,
        book_title: 'シェルスクリプトマガジン vol.54',
        author: 'しょっさん',
        publisher: 'USP研究所',
        image_uml: 'https://uec.usp-lab.com/INFO/IMG/SHELLSCRIPTMAG_VOL54.JPG'
      },
      {
        id: 2,
        book_title: 'シェルスクリプトマガジン vol.55',
        author: 'しょっさん',
        publisher: 'USP研究所',
        image_uml: 'https://uec.usp-lab.com/INFO/IMG/SHELLSCRIPTMAG_VOL55.JPG'
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('libraries', null, {});
  }
};
