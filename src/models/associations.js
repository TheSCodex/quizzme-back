const User = require('./User.js');
const Role = require('./Role.js');
const Template = require('./Template.js');
const Form = require('./Form.js');
const Answer = require('./Answer.js');
const Question = require('./Question.js');

function setupAssociations() {
  // Role and User association
  Role.hasMany(User, { foreignKey: 'roleId' });
  User.belongsTo(Role, { foreignKey: 'roleId' });

  // User and Template association
  User.hasMany(Template, { foreignKey: 'userId' });
  Template.belongsTo(User, { foreignKey: 'userId' });

  // Template and Form association
  Template.hasMany(Form, { foreignKey: 'templateId' });
  Form.belongsTo(Template, { foreignKey: 'templateId' });

  // User and Form association
  User.hasMany(Form, { foreignKey: 'userId' });
  Form.belongsTo(User, { foreignKey: 'userId' });

  // Form and Answer association
  Form.hasMany(Answer, { foreignKey: 'formId' });
  Answer.belongsTo(Form, { foreignKey: 'formId' });

  // Answer and Question association
  Question.hasMany(Answer, { foreignKey: 'questionId' });
  Answer.belongsTo(Question, { foreignKey: 'questionId' });

  // Template and Question association
  Template.hasMany(Question, { foreignKey: 'templateId' });
  Question.belongsTo(Template, { foreignKey: 'templateId' });
}

module.exports = setupAssociations;