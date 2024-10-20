'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Template = require('../src/models/Template.js');
    await queryInterface.createTable(Template.tableName, Template.rawAttributes);
  },

  down: async (queryInterface, Sequelize) => {
    const Template = require('../src/models/Template.js');
    await queryInterface.dropTable(Template.tableName);
  },
};