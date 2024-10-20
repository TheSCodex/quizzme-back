'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { default: Role } = await import('../src/models/Role.js');
    await queryInterface.bulkInsert(Role.tableName, [
      {
        name: 'admin',
        permissions: JSON.stringify({
          templates: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          users: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          forms: {
            fill: true,
            read: true,
            update: true,
            delete: true,
          },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'user',
        permissions: JSON.stringify({
          templates: {
            create: true,
            read: true,
            update: false,
            delete: false,
          },
          users: {
            create: false,
            read: true,
            update: true,
            delete: false,
          },
          forms: {
            fill: true,
            read: true,
            update: true,
            delete: false,
          },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'guest',
        permissions: JSON.stringify({
          templates: {
            create: false,
            read: true,
            update: false,
            delete: false,
          },
          users: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          forms: {
            fill: false,
            read: false,
            update: false,
            delete: false,
          },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const { default: Role } = await import('../src/models/Role.js');
    await queryInterface.bulkDelete(Role.tableName, null, {});
  },
};