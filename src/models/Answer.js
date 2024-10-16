import { DataTypes } from "sequelize";
import connection from "../db.js";
import Form from "./Form.js";
import Question from "./Question.js";

const Answer = connection.define("Answer", {
  formId: {
    type: DataTypes.INTEGER,
    references: {
      model: Form,
      key: "id",
    },
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Question,
      key: "id",
    },
    allowNull: false,
  },
  response: {
    type: DataTypes.JSON, //Switch to JSONB when going postgres
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Relationships
Answer.belongsTo(Form, { foreignKey: "formId" });
Answer.belongsTo(Question, { foreignKey: "questionId" });

Answer.sync();

export default Answer;
