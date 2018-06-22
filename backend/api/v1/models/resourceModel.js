var db = require('../dbconnection');

var Resource = {  
	getAll: function(callback) {  
			return db.query("SELECT * FROM resource", callback);  
	},
	getById: function(id, callback) {  
		return db.query("SELECT * FROM resource WHERE id=?", [id], callback);  
	}
};  
module.exports = Resource;