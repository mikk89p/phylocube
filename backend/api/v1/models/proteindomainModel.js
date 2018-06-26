var db = require('../dbconnection');

var ProteinDomain = {  
	getAll: function(callback) {  
			return db.query("SELECT * FROM protein_domain", callback);  
	},
	getByAcc: function(acc, callback) {  
		return db.query("SELECT * FROM protein_domain WHERE acc=?", [acc], callback);  
	},

	getProteinDomainWithDistributionByAcc: function(acc, callback) {  
		return db.query("SELECT * FROM protein_domain JOIN distribution ON protein_domain.id = distribution.protein_domain_id WHERE protein_domain.acc=?", [acc], callback);  
	},

	getAllProteinDomainsByResourceType: function(type, callback) {  
    sql = "SELECT * FROM protein_domain JOIN resource ON protein_domain.resource_id = resource.id WHERE resource.type=?";
    if (type == 'clanpfam') {
      sql = "SELECT * FROM protein_domain JOIN resource ON protein_domain.resource_id = resource.id " + 
            "LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " + 
            "WHERE (resource.type='clan' OR resource.type='pfam') AND clan_membership.clan_acc IS NULL";
    }
    return db.query(sql, [type], callback);  
	},

	getAllProteinDomainsWithDistributionByResourceType: function(type, callback) { 
    sql = "SELECT * FROM protein_domain JOIN distribution ON protein_domain.id = distribution.protein_domain_id JOIN resource ON protein_domain.resource_id = resource.id WHERE resource.type=?"
    if (type == 'clanpfam') {
      sql = "SELECT * FROM protein_domain JOIN distribution ON protein_domain.id = distribution.protein_domain_id " +
            "JOIN resource ON protein_domain.resource_id = resource.id " + 
            "LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " + 
            "WHERE (resource.type='clan' OR resource.type='pfam') AND clan_membership.clan_acc IS NULL";
    } 
		return db.query(sql, [type], callback);  
	}
};  
module.exports = ProteinDomain;