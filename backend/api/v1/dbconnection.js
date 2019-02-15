const mysql = require('mysql');
const dotenv = require('dotenv');

//Config
dotenv.config({path: 'database.env'})

// Connections must be pooled
var pool  = mysql.createPool({
  connectionLimit: 200, // TODO : Which size to set
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

var getDbConnection = function(callback) {
  pool.getConnection(function(err, connection) {
      // console.log('Get connection threadId:', connection.threadId);
      callback(err, connection); // If connetion is aquired -> function call 
  });
};


var sqlQuery = function (sql, params, callback) {
  var result;
  getDbConnection(function(err, dbConnection) {
    if (err) {
      // console.log('No Connection');
    } else if (params && params.length > 0) {
      //console.log(sql);
      dbConnection.query(sql, params, (err, res) => {
        callback(err,res, dbConnection);
      });
    } else {
      //console.log(sql);
       dbConnection.query(sql, (err, res) => {
        callback(err,res, dbConnection);
      });
    }
    
  }); 
}

module.exports = { sqlQuery, getDbConnection };


  /*con.on('enqueue', function(sequence) {
    // if (sequence instanceof mysql.Sequence.Query) {
    if ('Query' === sequence.constructor.name) {
      console.log(sequence.sql);
    }
  });*/
