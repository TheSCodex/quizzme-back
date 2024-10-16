import { DataTypes } from "sequelize";
import connection from "../db.js";
import User from "./User.js";

const Template = connection.define(
  "Template",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
      default: "No image provided",
    },
    accessType: {
      type: DataTypes.ENUM("public", "private"),
      allowNull: false,
      defaultValue: "public",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    category: {
      type: DataTypes.ENUM("education", "health", "technology", "entertainment", "other"),
      allowNull: false,
      defaultValue: "other",
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Template, { foreignKey: "createdBy" });
Template.belongsTo(User, { foreignKey: "createdBy" });

Template.sync();

export default Template;
