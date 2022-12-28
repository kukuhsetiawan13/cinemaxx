'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsTo(models.User, {
        foreignKey: 'authorId'
      })
      Movie.belongsTo(models.Genre, {
        foreignKey: 'genreId'
      })
      Movie.hasMany(models.Wishlist)
    }
  }
  Movie.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Title can not be empty'},
        notEmpty: {msg: 'Title can not be empty'}
      }
    },
    synopsis: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Synopsis can not be empty'},
        notEmpty: {msg: 'Synopsis can not be empty'}
      }
    },
    trailerUrl: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 1,
          msg: 'Minimum rating is 1'
        }
      }
    },
    genreId: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};