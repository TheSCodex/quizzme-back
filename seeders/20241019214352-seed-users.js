'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bcrypt = await import('bcrypt');
    const hashedAdminPassword = await bcrypt.hash('admin_password', 10);
    const hashedUserPassword = await bcrypt.hash('user_password', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        roleId: 1, // Assuming role with ID 1 exists
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'User',
        email: 'user@example.com',
        password: hashedUserPassword,
        roleId: 2, // Assuming role with ID 2 exists
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};