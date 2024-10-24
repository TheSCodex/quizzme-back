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
      default: "https://res.cloudinary.com/djgvhqhdo/image/upload/v1729743174/data-2311261_1280_vfciyl.png",
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

module.exports = Template;
