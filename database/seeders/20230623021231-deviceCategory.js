'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {


  
    return queryInterface.bulkInsert('DevicesCategories', 
    [
    {
      type: 'Celulares',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'Tabletas',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'PC',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'Laptop',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    ]);
  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('DevicesCategories', null, {})
  }
};