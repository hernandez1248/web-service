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
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre del dispositivo es obligatorio"
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          msg: "La marca del dispositivo solo debe de contener letras"
        }
      }
    },
    model: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El modelo del dispositivo es obligatorio"
        },
        is: {
          args: /^[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          msg: "El modelo del dispositivo solo debe de contener letras y numeros"
        }
      }
    },
    image: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      validate: {
        isUrl: {
          msg: "La URL del avatar no es válida. Debe ser una URL completa.",
        },
      },
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