'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(64),
        allowNull: false, 
      },
      phone: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique:true,
      },
      password: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      rol: {
        type: Sequelize.STRING(16),
        allowNull: false,
        defaultValue:'empleado',
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
    await queryInterface.dropTable('Users');
  }
};