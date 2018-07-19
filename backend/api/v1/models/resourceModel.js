var db = require('../dbconnection');

var Resource = {  
	getAll: function(callback) {  
		db.sqlQuery("SELECT * FROM resource", [], callback);  
	},
	getByType: function(type, callback) {  
		db.sqlQuery("SELECT * FROM resource WHERE type=?", [type], callback);  
	}
};  
module.exports = Resource;