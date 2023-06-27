'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServicesCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here        
      models.Servicescategory.hasMany(models.Order,
        {
          as:'order', //alias parala relacion
          foreignKey: 'servicesId', //pf en products
        }
        );
    }
  }
  
  ServicesCategory.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ServicesCategory',
  });
  return ServicesCategory;
};