'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Devices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      brand: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      model: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },      
      image: {
        type: Sequelize.STRING(1024),
        allowNull: false,
      },
      deviceCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DevicesCategories',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Devices');
  }
};