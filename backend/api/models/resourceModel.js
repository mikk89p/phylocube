const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({path: 'database.env'})

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});
/*
con.connect(function(err) {
  if (err) {
	console.log(err);
  } else {
	console.log("Connected!");
	con.query(sql, function (err, result) {
		if (err) console.log(err);
		console.log("Table created");
		
  });
  }
});*/