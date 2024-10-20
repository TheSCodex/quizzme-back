const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const connection = new Sequelize({
  dialect: 'mysql',
  host: process.env.SQLHOST,
  username: process.env.SQLUSER,
  password: process.env.SQLPASSWORD,
  database: process.env.SQLDATABASE,
  port: process.env.SQLPORT,
});

module.exports = connection;