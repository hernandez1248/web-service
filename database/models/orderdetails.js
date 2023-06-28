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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //El monto total no permite agregar campos vacios
        notNull: {
          msg: 'El monto total es obligatorio'
        },
        //El monto total solo podra permitir agregar numeros
        is: {
          args: [/^[0-9\s]+$/i ],
          msg: "El monto total debe contener solo números enteros."
        }
      }
    },
    quantityComponent: {
      type: DataTypes.STRING,
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
    unitPrice:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //El precio unitario no permite agregar campos vacios
        notNull: {
          msg: 'El precio unitario es obligatorio'
        },
        //El precio unitario solo podra permitir agregar numeros
        is: {
          args: [/^[0-9\s]+$/i ],
          msg: "El precio unitario solo permite números."
        }
      }
    },
  }, {
    sequelize,
    modelName: 'OrderDetails',
  });
  return OrderDetails;
};