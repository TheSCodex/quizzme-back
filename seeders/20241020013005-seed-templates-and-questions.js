'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Template = require('../src/models/Template.js');
    const Question = require('../src/models/Question.js');

    // Insert templates
    const templates = await queryInterface.bulkInsert('templates', [
      {
        title: 'Education Template',
        description: 'Description for Education Template',
        picture: 'education.png',
        accessType: 'public',
        createdBy: 1,
        tags: JSON.stringify(['education', 'learning']),
        category: 'education',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Health Template',
        description: 'Description for Health Template',
        picture: 'health.png',
        accessType: 'private',
        createdBy: 1,
        tags: JSON.stringify(['health', 'wellness']),
        category: 'health',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Technology Template',
        description: 'Description for Technology Template',
        picture: 'technology.png',
        accessType: 'public',
        createdBy: 2, // Assuming user with ID 2 exists
        tags: JSON.stringify(['technology', 'innovation']),
        category: 'technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { returning: true });

    console.log('Inserted templates:', templates);

    // Check if templates were inserted and returned correctly
    if (!templates || templates.length === 0) {
      throw new Error('Templates were not inserted correctly.');
    }

    // Fetch the inserted templates to get their IDs
    const insertedTemplates = await queryInterface.sequelize.query(
      'SELECT * FROM templates WHERE title IN (?, ?, ?)',
      {
        replacements: ['Education Template', 'Health Template', 'Technology Template'],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    console.log('Fetched inserted templates:', insertedTemplates);

    // Insert questions for each template
    const template1Id = insertedTemplates.find(t => t.title === 'Education Template').id;
    const template2Id = insertedTemplates.find(t => t.title === 'Health Template').id;
    const template3Id = insertedTemplates.find(t => t.title === 'Technology Template').id;

    await queryInterface.bulkInsert('questions', [
      // Questions for Education Template
      {
        templateId: template1Id,
        questionText: 'What is the capital of France?',
        questionType: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        templateId: template1Id,
        questionText: 'Which of the following is a prime number?',
        questionType: 'multiple_choice',
        options: JSON.stringify(['2', '4', '6', '8']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Questions for Health Template
      {
        templateId: template2Id,
        questionText: 'How many hours of sleep do you get on average?',
        questionType: 'numeric',
        minValue: 0,
        maxValue: 24,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        templateId: template2Id,
        questionText: 'Do you exercise regularly?',
        questionType: 'boolean',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Questions for Technology Template
      {
        templateId: template3Id,
        questionText: 'What is the latest version of JavaScript?',
        questionType: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        templateId: template3Id,
        questionText: 'Which of the following is a programming language?',
        questionType: 'multiple_choice',
        options: JSON.stringify(['HTML', 'CSS', 'JavaScript', 'SQL']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Question = require('../src/models/Question.js');
    const Template = require('../src/models/Template.js');
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('templates', null, {});
  },
};