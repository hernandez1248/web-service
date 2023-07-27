'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {


  
    return queryInterface.bulkInsert('Devices', 
    [
    {
      brand: 'Samsung',
      model: 'A52',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand: 'Samsung',
      model: 'A10',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand: 'Dell',
      model: 'Inspiron 15 3000',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brand: 'Alcatel',
      model: 'Pixi 3',
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
