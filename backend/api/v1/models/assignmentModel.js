var db = require('../dbconnection');

var Resource = {  
	getAll: function(callback) {  
			return db.query("SELECT * FROM assignment", callback);  
	},
	getById: function(id, callback) {  
		return db.query("SELECT * FROM assignment WHERE id=?", [id], callback);  
	}
};  
module.exports = Resource;