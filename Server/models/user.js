'use strict';
const {
  Model
} = require('sequelize');

const {generateHashedPassword} = require('../helpers/bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Movie, {
        foreignKey: 'authorId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      User.hasMany(models.Wishlist)
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Email can not be empty'},
        notEmpty: {msg: 'Email can not be empty'},
        isEmail: {msg: 'Email is not valid'}
      }
    },    
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Password can not be empty'},
        notEmpty: {msg: 'Password can not be empty'}, 
        len: {
          args: [5],
          msg: 'Password must have at least 5 characters'
        }
      }
      
    },
    role: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook('beforeCreate', (user) => {
    user.password = generateHashedPassword(user.password)
    if(!user.role) user.role = 'Admin'
  })

  return User;
};