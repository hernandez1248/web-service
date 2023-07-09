'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Component extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Component.belongsTo(models.Device,
        {
          as:'devices', //alias parala relacion
          foreignKey: 'deviceId', //pf en products
        }
        );

      models.Component.hasMany(models.Orderdetails,
        {
          as:'orderdetail', //alias parala relacion
          foreignKey: 'componentsId', //pf en products
        }
        );
    }
  }
  
  Component.init({
    name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        //El nombre no permite el campo nulo o vacio
        notNull: {
          msg: 'El nombre es obligatorio'
        },
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        //El price no permite el campo nulo o vacio
        notNull: {
          msg: 'El precio es obligatorio'
        },
        //El price solo permite  numeros
        is: {
          args: [/^[0-9\s]+$/i ],
          msg: "El precio debe contener solo números."
        }
      }
    },
    stock: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        //El stock no permite el campo nulo o vacio
        notNull: {
          msg: 'El stock es obligatorio'
        },
        //El stock solo permite  numeros
        is: {
          args: [/^[0-9\s]+$/i ],
          msg: "El stock debe contener solo números."
        }
      }
    },
    deviceId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Component',
  });
  return Component;
};