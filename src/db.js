import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: process.env.SQLHOST,
  user: process.env.SQLUSER,
  password: process.env.SQLPASSWORD,
  database: process.env.SQLDATABASE,
  port: process.env.SQLPORT,
});


export default connection;