const { DataTypes } = require("sequelize");
const connection = require("../db.js");

const TemplateTag = connection.define(
  "template_tags",
  {
    templateId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'templates',
        key: "id",
      },
    },
    tagId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tags',
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

TemplateTag.sync();

module.exports = TemplateTag;