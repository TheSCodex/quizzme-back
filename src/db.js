import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootpass*",
  database: "kaan-kun",
  port: 3306,
});


export default connection;