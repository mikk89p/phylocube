const mysql = require('mysql');
const dotenv = require('dotenv');

//Config
dotenv.config({path: 'database.env'})

//Database connect
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

module.exports = con;