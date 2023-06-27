'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      models.Device.belongsTo(models.Devicescategory,
        {
          as:'deviceCategory', //alias parala relacion
          foreignKey: 'deviceCategoryId', //pf en products
        }
        );

        
      models.Device.hasMany(models.Component,
        {
          as:'component', //alias parala relacion
          foreignKey: 'deviceId', //pf en products
        }
        );

        
      models.Device.hasMany(models.Order,
        {
          as:'order', //alias parala relacion
          foreignKey: 'deviceId', //pf en products
        }
        );
    }
  }
  Device.init({
    brand: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    model: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    deviceCategoryId: {
      type: DataTypes.INTEGER,
    },
    
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};