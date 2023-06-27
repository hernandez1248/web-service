'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.State.belongsTo(models.Order,
        {
          as:'order', //alias parala relacion
          foreignKey: 'ordersId', //pf en products
        }
        );

    }
  }
  State.init({
    ordersId: {
      type: DataTypes.INTEGER,
    },
    date: DataTypes.STRING,
    status: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'State',
  });
  return State;
};