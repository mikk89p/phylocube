var dotenv = require('dotenv');

const result = dotenv.config({path: 'database.env'})
 
if (result.error) {
  throw result.error
}
 
console.log(result.parsed)


var mysql = require('mysql');


var con = mysql.createConnection({
  /* TODO https://www.npmjs.com/package/dotenv */ 
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


 con.connect(function(err) {
  if (err) {
	console.log(err);
  } else {
	console.log("Connected!");
	var sql = "CREATE TABLE test (name VARCHAR(255))";
	con.query(sql, function (err, result) {
		if (err) console.log(err);
		console.log("Table created");
		
  });
  }
});

//con.end();
  

