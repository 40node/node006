'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN
  }, {
    underscored: true,
  });
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.Library, { foreignKey: 'user_id'});
  };
  return user;
};