const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.SQLUSER,
    password: process.env.SQLPASSWORD,
    database: process.env.SQLDATABASE,
    host: process.env.SQLHOST,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};