const User = require("./User.js");
const Role = require("./Role.js");
const Template = require("./Template.js");
const Tag = require("./Tag.js");
const Form = require("./Form.js");
const Answer = require("./Answer.js");
const Question = require("./Question.js");
const TemplateTag = require("./TemplateTag.js");
const TemplateAccess = require("./TemplateAccess.js");

function setupAssociations() {
  // Role and User association
  Role.hasMany(User, { foreignKey: "roleId" });
  User.belongsTo(Role, { foreignKey: "roleId" });

  // User and Template association
  User.hasMany(Template, { foreignKey: "createdBy" });
  Template.belongsTo(User, { foreignKey: "createdBy" });

  // Template and Form association
  Template.hasMany(Form, { foreignKey: "templateId" });
  Form.belongsTo(Template, { foreignKey: "templateId" });

  // Template and User Access association
  Template.belongsToMany(User, { through: TemplateAccess, as: 'authorizedUsers', onDelete: 'CASCADE' });
  User.belongsToMany(Template, { through: TemplateAccess, as: 'accessibleTemplates', onDelete: 'CASCADE' });  

  // User and Form association
  User.hasMany(Form, { foreignKey: "userId" });
  Form.belongsTo(User, { foreignKey: "userId" });

  // Form and Answer association
  Form.hasMany(Answer, { foreignKey: "formId" });
  Answer.belongsTo(Form, { foreignKey: "formId" });

  // Answer and Question association
  Question.hasMany(Answer, { foreignKey: "questionId" });
  Answer.belongsTo(Question, { foreignKey: "questionId" });

  // Template and Question association
  Template.hasMany(Question, { foreignKey: "templateId", as: "questions" });
  Question.belongsTo(Template, { foreignKey: "templateId", as: "template" });

  // Template and Tag association
  Template.belongsToMany(Tag, { through: TemplateTag, onDelete: "CASCADE" });
  Tag.belongsToMany(Template, { through: TemplateTag, onDelete: "CASCADE" });
}

module.exports = setupAssociations;
