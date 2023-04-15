'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' });
      // scopes should be defined here
      Post.addScope('withUser', {
        attributes: {
          exclude: ['deletedAt', 'UserId', 'userId'],
        },
        order: [['id', 'DESC']],
        include: [{ model: models.User, as: 'user' }],
      });
    }
  }
  Post.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    modelName: 'Post',
    defaultScope: {
      attributes: {
        exclude: ['deletedAt', 'UserId', 'userId'],
      },
      order: [['id', 'DESC']]
    }
  });
  return Post;
};