'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    // User hasMany Library
    return queryInterface.addColumn(
      'Libraries', // name of Target model
      'user_id', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'Users', // name of Source model
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    // remove User hasMany Library
    return queryInterface.removeColumn(
      'Libraries', // name of the Target model
      'user_id' // key we want to remove
    );
  }
};