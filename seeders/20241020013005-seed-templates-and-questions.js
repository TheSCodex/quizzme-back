'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Template = require('../src/models/Template.js');
    const Question = require('../src/models/Question.js');
    const Tag = require('../src/models/Tag.js');
    const TemplateTag = require('../src/models/TemplateTag.js');

    // Insert templates
    const templates = await queryInterface.bulkInsert('templates', [
      {
        title: 'Education Template',
        description: 'Description for Education Template',
        picture: 'education.png',
        accessType: 'public',
        createdBy: 1,
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
        category: 'health',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Technology Template',
        description: 'Description for Technology Template',
        picture: 'technology.png',
        accessType: 'public',
        createdBy: 1,
        category: 'technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Entertainment Template',
        description: 'Description for Entertainment Template',
        picture: 'entertainment.png',
        accessType: 'public',
        createdBy: 1,
        category: 'entertainment',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Other Template 1',
        description: 'Description for Other Template 1',
        picture: 'other1.png',
        accessType: 'private',
        createdBy: 1,
        category: 'other',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Other Template 2',
        description: 'Description for Other Template 2',
        picture: 'other2.png',
        accessType: 'public',
        createdBy: 1,
        category: 'other',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Other Template 3',
        description: 'Description for Other Template 3',
        picture: 'other3.png',
        accessType: 'private',
        createdBy: 1,
        category: 'other',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Other Template 4',
        description: 'Description for Other Template 4',
        picture: 'other4.png',
        accessType: 'public',
        createdBy: 1,
        category: 'other',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { returning: true });

    console.log('Inserted templates:', templates);

    // Check if templates were inserted and returned correctly
    if (!templates || templates.length === 0) {
      throw new Error('Templates were not inserted correctly.');
    }

    // Insert tags
    const tags = await queryInterface.bulkInsert('tags', [
      { name: 'education', createdAt: new Date(), updatedAt: new Date() },
      { name: 'learning', createdAt: new Date(), updatedAt: new Date() },
      { name: 'health', createdAt: new Date(), updatedAt: new Date() },
      { name: 'wellness', createdAt: new Date(), updatedAt: new Date() },
      { name: 'technology', createdAt: new Date(), updatedAt: new Date() },
      { name: 'innovation', createdAt: new Date(), updatedAt: new Date() },
      { name: 'entertainment', createdAt: new Date(), updatedAt: new Date() },
      { name: 'other', createdAt: new Date(), updatedAt: new Date() },
    ], { returning: true });

    console.log('Inserted tags:', tags);

    // Fetch the inserted templates and tags to get their IDs
    const insertedTemplates = await queryInterface.sequelize.query(
      'SELECT * FROM templates WHERE title IN (?, ?, ?, ?, ?, ?, ?, ?)',
      {
        replacements: [
          'Education Template', 'Health Template', 'Technology Template',
          'Entertainment Template', 'Other Template 1', 'Other Template 2',
          'Other Template 3', 'Other Template 4'
        ],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const insertedTags = await queryInterface.sequelize.query(
      'SELECT * FROM tags WHERE name IN (?, ?, ?, ?, ?, ?, ?, ?)',
      {
        replacements: [
          'education', 'learning', 'health', 'wellness', 'technology', 'innovation',
          'entertainment', 'other'
        ],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    console.log('Fetched inserted templates:', insertedTemplates);
    console.log('Fetched inserted tags:', insertedTags);

    // Map tag names to their IDs
    const tagMap = {};
    insertedTags.forEach(tag => {
      tagMap[tag.name] = tag.id;
    });

    // Insert associations into template_tags table
    const templateTagAssociations = [
      { templateId: insertedTemplates.find(t => t.title === 'Education Template').id, tagId: tagMap['education'] },
      { templateId: insertedTemplates.find(t => t.title === 'Education Template').id, tagId: tagMap['learning'] },
      { templateId: insertedTemplates.find(t => t.title === 'Health Template').id, tagId: tagMap['health'] },
      { templateId: insertedTemplates.find(t => t.title === 'Health Template').id, tagId: tagMap['wellness'] },
      { templateId: insertedTemplates.find(t => t.title === 'Technology Template').id, tagId: tagMap['technology'] },
      { templateId: insertedTemplates.find(t => t.title === 'Technology Template').id, tagId: tagMap['innovation'] },
      { templateId: insertedTemplates.find(t => t.title === 'Entertainment Template').id, tagId: tagMap['entertainment'] },
      { templateId: insertedTemplates.find(t => t.title === 'Other Template 1').id, tagId: tagMap['other'] },
      { templateId: insertedTemplates.find(t => t.title === 'Other Template 2').id, tagId: tagMap['other'] },
      { templateId: insertedTemplates.find(t => t.title === 'Other Template 3').id, tagId: tagMap['other'] },
      { templateId: insertedTemplates.find(t => t.title === 'Other Template 4').id, tagId: tagMap['other'] },
    ];

    await queryInterface.bulkInsert('template_tags', templateTagAssociations, {});

    // Insert questions for each template
    const template1Id = insertedTemplates.find(t => t.title === 'Education Template').id;
    const template2Id = insertedTemplates.find(t => t.title === 'Health Template').id;
    const template3Id = insertedTemplates.find(t => t.title === 'Technology Template').id;
    const template4Id = insertedTemplates.find(t => t.title === 'Entertainment Template').id;
    const template5Id = insertedTemplates.find(t => t.title === 'Other Template 1').id;
    const template6Id = insertedTemplates.find(t => t.title === 'Other Template 2').id;
    const template7Id = insertedTemplates.find(t => t.title === 'Other Template 3').id;
    const template8Id = insertedTemplates.find(t => t.title === 'Other Template 4').id;

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
      // Questions for Entertainment Template
      {
        templateId: template4Id,
        questionText: 'Who is your favorite actor?',
        questionType: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        templateId: template4Id,
        questionText: 'Which movie won the best picture Oscar in 2020?',
        questionType: 'multiple_choice',
        options: JSON.stringify(['Parasite', '1917', 'Joker', 'Once Upon a Time in Hollywood']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Questions for Other Template 1
      {
        templateId: template5Id,
        questionText: 'What is your favorite hobby?',
        questionType: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        templateId: template5Id,
        questionText: 'Which of the following is a hobby?',
        questionType: 'multiple_choice',
        options: JSON.stringify(['Reading', 'Sleeping', 'Eating', 'All of the above']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Questions for Other Template 2
      {
        templateId: template6Id,
        questionText: 'What is your favorite color?',
        questionType: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        templateId: template6Id,
        questionText: 'Which of the following is a color?',
        questionType: 'multiple_choice',
        options: JSON.stringify(['Red', 'Blue', 'Green', 'Yellow']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Questions for Other Template 3
      {
        templateId: template7Id,
        questionText: 'What is your favorite animal?',
        questionType: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        templateId: template7Id,
        questionText: 'Which of the following is an animal?',
        questionType: 'multiple_choice',
        options: JSON.stringify(['Dog', 'Cat', 'Bird', 'Fish']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Questions for Other Template 4
      {
        templateId: template8Id,
        questionText: 'What is your favorite season?',
        questionType: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        templateId: template8Id,
        questionText: 'Which of the following is a season?',
        questionType: 'multiple_choice',
        options: JSON.stringify(['Spring', 'Summer', 'Fall', 'Winter']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Question = require('../src/models/Question.js');
    const Template = require('../src/models/Template.js');
    const Tag = require('../src/models/Tag.js');
    const TemplateTag = require('../src/models/TemplateTag.js');
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('template_tags', null, {});
    await queryInterface.bulkDelete('tags', null, {});
    await queryInterface.bulkDelete('templates', null, {});
  },
};