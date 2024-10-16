import { DataTypes } from "sequelize";
import connection from "../db.js";
import Template from "./Template.js";

const Question = connection.define("Question", {
  templateId: {
    type: DataTypes.INTEGER,
    references: {
      model: Template,
      key: "id",
    },
    allowNull: false,
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  questionType: {
    type: DataTypes.ENUM("text", "multiple_choice", "numeric", "boolean"),
    allowNull: false,
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  minValue: {
    type: DataTypes.INTEGER,  // Minimum value for numeric questions
    allowNull: true,
  },
  maxValue: {
    type: DataTypes.INTEGER,  // Maximum value for numeric questions
    allowNull: true,
  },
}, {
  timestamps: true,
});

Template.hasMany(Question, { foreignKey: "templateId" });
Question.belongsTo(Template, { foreignKey: "templateId" });

Question.sync();

export default Question;
