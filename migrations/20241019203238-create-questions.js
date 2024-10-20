'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Question = require('../src/models/Question.js');
    await queryInterface.createTable(Question.tableName, Question.rawAttributes);
  },

  down: async (queryInterface, Sequelize) => {
  const Question = require('../src/models/Question.js');
    await queryInterface.dropTable(Question.tableName);
  },
};