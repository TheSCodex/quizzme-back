'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Form = require('../src/models/Form.js');
    await queryInterface.createTable(Form.tableName, Form.rawAttributes);
  },

  down: async (queryInterface, Sequelize) => {
    const Form = require('../src/models/Form.js');
    await queryInterface.dropTable(Form.tableName);
  },
};