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
      models.Order.belongsTo(models.Servicescategory,
        {
          as:'servicescategory', //alias parala relacion
          foreignKey: 'servicesId', //pf en products
        }
        );

      models.Order.belongsTo(models.Device,
        {
          as:'device', //alias parala relacion
          foreignKey: 'deviceId', //pf en products
        }
        );

      models.Order.belongsTo(models.User,
        {
          as:'user', //alias parala relacion
          foreignKey: 'userId', //pf en products
        }
        );

      models.Order.hasMany(models.Orderdetails,
        {
          as:'orderdetails', //alias parala relacion
          foreignKey: 'ordersId', //pf en products
        }
        );

      models.Order.hasMany(models.State,
        {
          as:'state', //alias parala relacion
          foreignKey: 'ordersId', //pf en products
        }
        );
    }
  }
  order.init({
    date: DataTypes.STRING,
    fullName: DataTypes.STRING,
    phone: DataTypes.STRING,
    servicesId: {
      type: DataTypes.INTEGER,
    },
    deviceId: {
      type: DataTypes.INTEGER,
    },
    color: DataTypes.STRING,
    observations: DataTypes.STRING,
    fullPay: DataTypes.STRING,
    advancePay: DataTypes.STRING,
    remainingPay: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};