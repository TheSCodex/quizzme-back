const { DataTypes } = require("sequelize");
const connection = require("../db.js");

const TemplateAccess = connection.define(
  "templateAccess",
  {
    templateId: {
      type: DataTypes.INTEGER,
      references: {
        model: "templates",
        key: "id",
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

TemplateAccess.sync();

module.exports = TemplateAccess;
