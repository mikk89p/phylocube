var db = require('../dbconnection');

var Resource = {  
	getAllResources: function(callback) {  
			return db.query("SELECT * FROM resource", callback);  
	},
	getResourceById: function(id, callback) {  
		return db.query("SELECT * FROM resource WHERE Id=?", [id], callback);  
	}
};  
module.exports = Resource;