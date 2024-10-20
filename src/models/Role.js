const { DataTypes } = require("sequelize");
const connection = require("../db.js");

const Role = connection.define(
  "role",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    permissions: {
      type: DataTypes.JSON, //Switch to JSONB when going postgres
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    timestamps: true,
  }
);

Role.sync();

module.exports = Role;
