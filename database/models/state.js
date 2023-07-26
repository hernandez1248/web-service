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
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      validate: {
        //La fecha solo permite el siguiente formato
        is: {
          args: [/^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/i ],
          msg: "La fecha de nacimiento debe tener el formato: dd/mm/aaaa"
        }
      }
    },
    
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //El status no permite el campo nulo o vacio
        notNull: {
          msg: 'El status es obligatorio'
        },
        //El status solo permite letras, y no numeros
        is: {
          args: [/^[A-Z a-z áéíóú]+$/i ],
          msg: "El status debe de contener solo letras"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //El descripción no permite el campo nulo o vacio
        notNull: {
          msg: 'La descripción es obligatoria'
        },
        //El descripción permite letras, numeros, comas, puntos, acentos, con un limite de 300 caracteres
        is: {
          args: [/^[0-9a-z áéíóú , . A-Z\s]+$/i ],
          msg: "La descripción debe contener menos de 300 caracteres."
        }
      }
    },
  }, {
    sequelize,
    modelName: 'State',
  });
  return State;
};