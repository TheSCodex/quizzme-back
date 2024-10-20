'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Role = require('../src/models/Role.js');
    await queryInterface.createTable(Role.tableName, Role.rawAttributes);
  },

  down: async (queryInterface, Sequelize) => {
    const Role = require('../src/models/Role.js');
    await queryInterface.dropTable(Role.tableName);
  },
};