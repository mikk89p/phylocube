var db = require('../dbconnection');

var Resource = {  
	getAll: function(callback) {  
			return db.query("SELECT * FROM assignment", callback);  
	},
	getByAcc: function(acc, callback) {  
		return db.query("SELECT * FROM assignment JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id WHERE protein_domain.acc=?", [acc], callback);  
	}
};  
module.exports = Resource;