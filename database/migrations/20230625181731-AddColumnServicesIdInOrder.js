'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Orders',
        'servicesId',
        {
          type:Sequelize.DataTypes.INTEGER,   
          //establecer la relacion a la tabla y llave primaria   
          references: {
            model: 'ServicesCategories',
            key: 'id'
          },
        //integridad referenciar
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          defaultValue: null,
          after: 'phone'
        },       
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Orders', 'servicesId')
    ]);
  }
};