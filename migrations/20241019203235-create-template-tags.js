'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const TemplateTag = require('../src/models/TemplateTag.js');
    await queryInterface.createTable(TemplateTag.tableName, TemplateTag.rawAttributes);
  },

  down: async (queryInterface, Sequelize) => {
    const TemplateTag = require('../src/models/TemplateTag.js');
    await queryInterface.dropTable(TemplateTag.tableName);
  },
};