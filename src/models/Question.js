const { DataTypes } = require("sequelize");
const connection = require("../db.js");

const Question = connection.define(
  "question",
  {
    templateId: {
      type: DataTypes.INTEGER,
      references: {
        model: "templates",
        key: "id",
      },
      allowNull: false,
    },
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    questionType: {
      type: DataTypes.ENUM('text', 'number', 'checkbox', 'multiple_choice'),
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON, //Switch to JSONB when going postgres
      allowNull: true,
    },
    minValue: {
      type: DataTypes.INTEGER, // Minimum value for numeric questions
      allowNull: true,
    },
    maxValue: {
      type: DataTypes.INTEGER, // Maximum value for numeric questions
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Question;
