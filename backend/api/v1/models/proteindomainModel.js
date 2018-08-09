var db = require('../dbconnection');

var ProteinDomain = {  
	getAll: function(callback) {  
		db.sqlQuery("SELECT * FROM protein_domain",[], callback);  
	},
	getByAcc: function(acc, callback) {  
		db.sqlQuery("SELECT * FROM protein_domain WHERE acc=?", [acc], callback);  
	},

	getProteinDomainWithDistributionByAcc: function(acc, callback) {  
		db.sqlQuery("SELECT * FROM protein_domain JOIN distribution ON protein_domain.id = distribution.protein_domain_id WHERE protein_domain.acc=?", [acc], callback);  
	},

	getDataByResourceType: function(type, callback) {  
    var columns = "acc,protein_domain.description,protein_domain.classification,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes";
    var sql = "SELECT " + columns + " FROM protein_domain JOIN resource ON protein_domain.resource_id = resource.id WHERE resource.type=?";
    if (type == 'clanpfam') {
      sql = "SELECT " + columns + " FROM protein_domain JOIN resource ON protein_domain.resource_id = resource.id " + 
            "LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " + 
            "WHERE (resource.type='clan' OR resource.type='pfam') AND clan_membership.clan_acc IS NULL";
    }
    db.sqlQuery(sql, [type], callback);  
	},

	getDataWithDistributionByResourceType: function(type, callback) { 
    var columns = "acc,protein_domain.description,protein_domain.classification,archaea,bacteria,eukaryota,virus,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes";
    var sql = "SELECT " + columns + " FROM protein_domain JOIN distribution ON protein_domain.id = distribution.protein_domain_id JOIN resource ON protein_domain.resource_id = resource.id WHERE resource.type=?"
    if (type == 'clanpfam') {
      sql = "SELECT " + columns + " FROM protein_domain JOIN distribution ON protein_domain.id = distribution.protein_domain_id " +
            "JOIN resource ON protein_domain.resource_id = resource.id " + 
            "LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " + 
            "WHERE (resource.type='clan' OR resource.type='pfam') AND clan_membership.clan_acc IS NULL";
    } 
		db.sqlQuery(sql, [type], callback);  
  }
  
  
};  
module.exports = ProteinDomain;