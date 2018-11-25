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
        user_id: 1,
        image_uml: 'https://uec.usp-lab.com/INFO/IMG/SHELLSCRIPTMAG_VOL54.JPG'
      },
      {
        id: 2,
        book_title: 'シェルスクリプトマガジン vol.55',
        author: 'しょっさん',
        publisher: 'USP研究所',
        user_id: 1,
        image_uml: 'https://uec.usp-lab.com/INFO/IMG/SHELLSCRIPTMAG_VOL55.JPG'
      },
      {
        id: 3,
        book_title: 'シェルスクリプトマガジン vol.56',
        author: 'しょっさん',
        publisher: 'USP研究所',
        user_id: 2,
        image_uml: 'https://uec.usp-lab.com/INFO/IMG/SHELLSCRIPTMAG_VOL54.JPG'
      },
      {
        id: 4,
        book_title: 'シェルスクリプトマガジン vol.57',
        author: 'しょっさん',
        publisher: 'USP研究所',
        user_id: 3,
        image_uml: 'https://uec.usp-lab.com/INFO/IMG/SHELLSCRIPTMAG_VOL54.JPG'
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('libraries', null, {});
  }
};
