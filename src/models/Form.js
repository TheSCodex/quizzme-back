const {DataTypes} = require('sequelize');
const connection = require('../db.js');

const Form = connection.define("form", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: "id",
    },
    allowNull: false,
  },
  templateId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'templates',
      key: "id",
    },
    allowNull: false,
  },
  submissionTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = Form;