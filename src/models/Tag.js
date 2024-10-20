const { DataTypes } = require("sequelize");
const connection = require("../db.js");

const Tag = connection.define(
  "tag",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

Tag.sync();

module.exports = Tag;