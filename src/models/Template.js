const { DataTypes } = require("sequelize");
const connection = require("../db.js");

const Template = connection.define(
  "template",
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
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON, //Switch to JSONB when going postgres
      allowNull: true,
      defaultValue: [],
    },
    category: {
      type: DataTypes.ENUM(
        "education",
        "health",
        "technology",
        "entertainment",
        "other"
      ),
      allowNull: false,
      defaultValue: "other",
    },
  },
  {
    timestamps: true,
  }
);

Template.sync();

module.exports = Template;
