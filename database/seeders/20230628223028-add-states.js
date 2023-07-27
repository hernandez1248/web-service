'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('States', [
      {ordersId: 1, date: '14/04/2023', status: 'Entregada', description: 'El dispositivo necesita de mantenimiento', createdAt: new Date(), updatedAt: new Date()},
      {ordersId: 1, date: '12/06/2023', status: 'En proceso', description: 'La batería del dispositivo necesita ser remplazada.', createdAt: new Date(), updatedAt: new Date()},
      {ordersId: 1, date: '18/03/2023', status: 'Cancelada', description: 'El cliente que solicitó la orden canceló el servicio.', createdAt: new Date(), updatedAt: new Date()},
      {ordersId: 1, date: '28/06/2023', status: 'Terminada', description: 'Se terminó el servicio solicitado, pero el cliente aún no ha solcitado la entrega de su dispositivo.', createdAt: new Date(), updatedAt: new Date()},
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('States', null, {});
  }
}
;
