const { DataTypes } = require("sequelize");
const connection = require("../db.js");

const Answer = connection.define(
  "answer",
  {
    formId: {
      type: DataTypes.INTEGER,
      references: {
        model: "forms",
        key: "id",
      },
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "questions",
        key: "id",
      },
      allowNull: false,
    },
    response: {
      type: DataTypes.JSON, //Switch to JSONB when going postgres
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Answer;
