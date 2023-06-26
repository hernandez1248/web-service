'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DevicesCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
    static associate(models) {
      // define association here
    }


  }


  DevicesCategory.init({
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El categoria de dispositivo es obligatorio"
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          msg: "La categoria de dispositivo solo debe contener letras"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'DevicesCategory',
  });
  return DevicesCategory;
};
