const { DataTypes } = require('sequelize');
const connection = require('../db.js');

const User = connection.define(
  'user',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'No image provided',
    },
    last_login_time: {
      type: DataTypes.DATE,
    },
    registration_time: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('active', 'blocked'),
      allowNull: false,
      defaultValue: 'active',
    },
    theme: {
      type: DataTypes.ENUM('light', 'dark'),
      allowNull: false,
      defaultValue: 'light',
    },
    language: {
      type: DataTypes.ENUM('en', 'es', 'fr'),
      allowNull: false,
      defaultValue: 'en',
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
      },
      defaultValue: 2,
      allowNull: false,
    },
    recovery_code: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    recovery_code_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

User.sync();

module.exports = User;