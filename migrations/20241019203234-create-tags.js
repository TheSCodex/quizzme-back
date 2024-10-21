'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Tag = require('../src/models/Tag.js');
    await queryInterface.createTable(Tag.tableName, Tag.rawAttributes);
  },

  down: async (queryInterface, Sequelize) => {
    const Tag = require('../src/models/Tag.js');
    await queryInterface.dropTable(Tag.tableName);
  },
};