var db = require('../dbconnection');

var ProteinDomain = {
  getAll: function (callback) {
    db.sqlQuery("SELECT * FROM protein_domain", [], callback);
  },
  getByAcc: function (acc, version, callback) {
    db.sqlQuery("SELECT * FROM protein_domain JOIN resource ON protein_domain.resource_id = resource.id  WHERE acc=? AND resource.version=?", [acc, version], callback);
  },

  getProteinDomainWithDistributionByAcc: function (acc, version, callback) {
    db.sqlQuery("SELECT * FROM protein_domain JOIN resource ON protein_domain.resource_id = resource.id JOIN distribution ON protein_domain.id = distribution.protein_domain_id WHERE protein_domain.acc=? AND resource.version=?", [acc, version], callback);
  },

  getDataByResourceType: function (type, version, callback) {
    var columns = "acc,protein_domain.description,protein_domain.classification,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes";
    // console.log('getDataByResourceType', type, version);
    if (type == 'clanpfam') {
      sql = "SELECT " + columns + " FROM protein_domain JOIN resource ON protein_domain.resource_id = resource.id " +
        "LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
        "WHERE (resource.type='clan' OR resource.type='pfam') AND resource.version=? AND clan_membership.clan_acc IS NULL ";
      db.sqlQuery(sql, [version], callback);
    } else {
      var sql = "SELECT " + columns + " FROM protein_domain JOIN resource ON protein_domain.resource_id = resource.id WHERE resource.type=? AND resource.version=?";
      db.sqlQuery(sql, [type, version], callback);
    }

  },

  getDataWithDistributionByResourceType: function (type, version, callback) {
    var columns = "acc,protein_domain.description,protein_domain.classification,archaea,bacteria,eukaryota,virus,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes";
    // console.log('getDataWithDistributionByResourceType', type, version);
    if (type == 'clanpfam') {
      sql = "SELECT " + columns + " FROM protein_domain JOIN distribution ON protein_domain.id = distribution.protein_domain_id " +
        "JOIN resource ON protein_domain.resource_id = resource.id " +
        "LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
        "WHERE (resource.type='clan' OR resource.type='pfam') AND resource.version=? AND clan_membership.clan_acc IS NULL";
      db.sqlQuery(sql, [version], callback);
    } else {
      var sql = "SELECT " + columns + " FROM protein_domain JOIN distribution ON protein_domain.id = distribution.protein_domain_id JOIN resource ON protein_domain.resource_id = resource.id WHERE resource.type=? AND resource.version=?"
      db.sqlQuery(sql, [type, version], callback);
    }

  }


};
module.exports = ProteinDomain;