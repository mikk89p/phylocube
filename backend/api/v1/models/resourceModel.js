db = require('../dbconnection');

var Resource = {  
	getAll: function(callback) {  
		return db.sqlQuery("SELECT * FROM resource", [], callback);  
	},
	getByType: function(type, callback) {  
		return db.sqlQuery("SELECT * FROM resource WHERE type=?", [type], callback);  
	}
};  
module.exports = Resource;