'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order.init({
    date: DataTypes.STRING,
    fullName: DataTypes.STRING,
    phone: DataTypes.STRING,
    color: DataTypes.STRING,
    observations: DataTypes.STRING,
    fullPay: DataTypes.STRING,
    advancePay: DataTypes.STRING,
    remainingPay: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};