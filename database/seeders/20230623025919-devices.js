'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {


  
    return queryInterface.bulkInsert('Devices', 
    [
    {
      brand: 'Samsung',
      model: 'A52',
      deviceCategoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand: 'Samsung',
      model: 'SM-G950F',
      deviceCategoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand: 'Dell',
      model: 'Inspiron 15 3000',
      deviceCategoryId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand: 'HP',
      model: 'HP LAPTOP 14-fq0xxx',
      deviceCategoryId: 4,
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
    await queryInterface.bulkDelete('Devices', null, {})
  }
};