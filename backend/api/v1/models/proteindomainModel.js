var db = require('../dbconnection');

var ProteinDomain = {  
	getAll: function(callback) {  
			return db.query("SELECT * FROM protein_domain", callback);  
	},
	getById: function(id, callback) {  
		return db.query("SELECT * FROM protein_domain WHERE id=?", [id], callback);  
	},

	getProteinDomainSummaryById: function(id, callback) {  
		return db.query("SELECT * FROM protein_domain JOIN summary ON protein_domain.id = summary.protein_domain_id WHERE protein_domain.Id=?", [id], callback);  
	},

	getAllProteinDomainsByResourceId: function(resource_id, callback) {  
		return db.query("SELECT * FROM protein_domain WHERE resource_id=?", [resource_id], callback);  
	},

	getAllProteinDomainsSummaryByResourceId: function(resource_id, callback) {  
		return db.query("SELECT * FROM protein_domain JOIN summary ON protein_domain.id = summary.protein_domain_id WHERE resource_id=?", [resource_id], callback);  
	}
};  
module.exports = ProteinDomain;