var db = require('../dbconnection');

var Taxonomy = {  
	getAll: function(callback) {  
			return db.query("SELECT * FROM taxonomy", callback);  
	},
	getById: function(id, callback) {  
		return db.query("SELECT * FROM taxonomy WHERE id=?", [id], callback);  
	}
};  
module.exports = Taxonomy;