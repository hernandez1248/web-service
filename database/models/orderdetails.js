'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.Orderdetails.belongsTo(models.Order,
        {
          as:'order', //alias parala relacion
          foreignKey: 'ordersId', //pf en products
        }
        );

        
      models.Orderdetails.belongsTo(models.Component,
        {
          as:'component', //alias parala relacion
          foreignKey: 'componentsId', //pf en products
        }
        );      
    }
  }
  OrderDetails.init({
    ordersId: {
      type: DataTypes.INTEGER,
    },
    componentsId: {
      type: DataTypes.INTEGER,
    },
    amountTotal: DataTypes.STRING,
    quantityComponent: DataTypes.STRING,
    unitPrice: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'OrderDetails',
  });
  return OrderDetails;
};