import { DataTypes } from "sequelize";
import connection from "../db.js";
import Template from "./Template.js";
import User from "./User.js";

const Form = connection.define("Form", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  templateId: {
    type: DataTypes.INTEGER,
    references: {
      model: Template,
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

// Relationships
Form.belongsTo(User, { foreignKey: "userId" });
Form.belongsTo(Template, { foreignKey: "templateId" });

Form.sync();

export default Form;
