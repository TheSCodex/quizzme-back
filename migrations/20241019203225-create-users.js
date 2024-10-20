'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const User = require('../src/models/User.js');
    await queryInterface.createTable(User.tableName, User.rawAttributes);
  },

  down: async (queryInterface, Sequelize) => {
    const User = require('../src/models/User.js');
    await queryInterface.dropTable(User.tableName);
  },
};