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
    }
  }
  Component.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //El nombre no permite el campo nulo o vacio
        notNull: {
          msg: 'El nombre es obligatorio'
        },
        //El nombre solo permite letras, y no numeros
        is: {
          args: [/^[0-9a-z áéíóú , . A-Z /\ +- \s]+$/i ],
          msg: "El nombre debe de contener solo letras"
        }
      }
    },
    price: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
  }, {
    sequelize,
    modelName: 'Component',
  });
  return Component;
};