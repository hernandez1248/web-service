'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class component extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  component.init({
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    stock: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'component',
  });
  return component;
};