const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const connection = new Sequelize(process.env.DB_STRING, {
  dialect: 'postgres',
});

module.exports = connection;