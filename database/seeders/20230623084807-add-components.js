'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Components', [
      {name: 'Batería 4.000 mAh', price: 189, stock: 24, deviceId: 1, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Pantalla 6.2 HD+', price: 399, stock: 20, deviceId: 2, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Cámara trasera 13MP f/1.9', price: 88, stock: 54, deviceId: 3, createdAt: new Date(), updatedAt: new Date()},
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Components', null, {});
  }
};
