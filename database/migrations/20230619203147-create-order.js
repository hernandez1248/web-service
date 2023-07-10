'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      fullName: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      observations: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      fullPay: {
        type: Sequelize.DECIMAL(10,2), 
        allowNull: false,
      },
      advancePay: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      remainingPay: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
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
    await queryInterface.dropTable('Orders');
  }
};
