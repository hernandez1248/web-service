'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Order,
        {
          as:'order', //alias parala relacion
          foreignKey: 'userId', //pf en products
        }
        );
    }
  }
  user.init({
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};