'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post);
    }
  }
  User.init({
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['password', 'deletedAt']
      },
      order: [['id', 'DESC']]
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ['password']
        }
      }
    }
  });
  return User;
};