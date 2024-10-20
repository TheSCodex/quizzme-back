'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Answer = require('../src/models/Answer.js');
    await queryInterface.createTable(Answer.tableName, Answer.rawAttributes);
  },

  down: async (queryInterface, Sequelize) => {
    const Answer = require('../src/models/Answer.js');
    await queryInterface.dropTable(Answer.tableName);
  },
};