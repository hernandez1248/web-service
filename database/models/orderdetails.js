'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetails extends Model {
    
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
    amountTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isNumeric: {
          msg: "El monto total debe contener solo números."
        },
      },
    },
    quantityComponent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        //La cantidad de componentes no permite agregar campos vacios
        notNull: {
          msg: 'La cantidad de componentes es obligatorio'
        },
        //La cantidad de componentes solo podra permitir agregar numeros
        is: {
          args: [/^[0-9\s]+$/i ],
          msg: "La cantidad de componentes debe contener solo números enteros."
        }
      }
    },
    unitPrice:  {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isNumeric: {
          msg: "El precio unitario solo permite números."
        },
      },
    }
  }, {
    sequelize,
    modelName: 'OrderDetails',
  });
  return OrderDetails;
};

