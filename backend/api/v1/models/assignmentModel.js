var db = require('../dbconnection');

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

var Assignment = {  
	getAll: function(callback) {  
			return db.query("SELECT * FROM assignment", callback);  
	},
	getByAcc: function(acc, callback) {  
		return db.query("SELECT * FROM assignment JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id WHERE protein_domain.acc=?", [acc], callback);  
  },
/*
 TODO  - which is faster RECURSIVE or BY full_taxonomy
  WITH RECURSIVE family_tree(tax_id) AS (
    SELECT tax_id, name, parent_id FROM taxon WHERE tax_id = 2
    UNION
    SELECT t.tax_id, t.name, t.parent_id 
      FROM family_tree, taxon t WHERE t.parent_id = family_tree.tax_id
  )
  SELECT tax_id, name FROM family_tree;
  These statements, which are often referred to as Common Table Expressions or CTEs
  https://www.postgresql.org/docs/9.6/static/queries-with.html
  */



 getByResourceTypeAndTaxonomyIdSlower: function(type, id, callback) {

  ids = "SELECT DISTINCT id FROM taxonomy WHERE full_taxonomy_id LIKE '%" +id+ ";%' AND (rank = 'species' OR rank = 'no rank')";
  //console.log(ids);
  columns = "DISTINCT protein_domain.acc, protein_domain.description,archaea,bacteria,eukaryota,virus,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes";

  if (type == 'clanpfam') {
    sql = "SELECT " + columns + " FROM assignment" +
    " JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
    " JOIN distribution ON protein_domain.id = distribution.protein_domain_id"+
    " JOIN resource ON protein_domain.resource_id = resource.id" + 
    " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc" +
    " WHERE (resource.type='clan' OR resource.type='pfam') AND clan_membership.clan_acc IS NULL" + 
    " AND assignment.taxonomy_id IN (" + ids + ");";
  } else {
    sql = "SELECT " + columns + " FROM assignment" +
    " JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
    " JOIN distribution ON protein_domain.id = distribution.protein_domain_id"+
    " JOIN resource ON protein_domain.resource_id = resource.id" + 
    " WHERE resource.type=?" +
    " AND assignment.taxonomy_id IN (" + ids + ");";
  }
  return db.query(sql, [type], callback);

 },
 

getByResourceTypeAndTaxonomyId: function(type, id, callback) { 
  // First query all taxonomy IDs
  // max_allowed_packet 4194304
  columns = "DISTINCT protein_domain.acc, protein_domain.description,archaea,bacteria,eukaryota,virus,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes";
  id_like = '"%;' +id+ ';%"';
  id_like2 = '"' +id+ ';%"'; //Before root e.g., Bacteria, archaea, eukaryota, viruses etc..

  sql = "SELECT DISTINCT id FROM taxonomy WHERE (full_taxonomy_id LIKE " + id_like + 
  " OR full_taxonomy_id LIKE "+id_like2 + ")" +
  " AND (rank = 'species' OR rank = 'no rank')";
  var ids_arr = []
  db.query(sql, function (err, rows) {
    if (err) {
      throw err;
    } else {
      for (var i of rows) {
        var string = JSON.stringify(i);
        var json =  JSON.parse(string);
        ids_arr.push(json.id);
      }
    }
    var ids = ids_arr.join(',');
    var bytes = lengthInUtf8Bytes(ids);
    if (ids_arr.length == 0 || bytes > 3000000) {
      ids = sql; // SLOWER
    } 
    if (type == 'clanpfam') {
      sql = "SELECT " + columns + " FROM assignment" +
      " JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
      " JOIN distribution ON protein_domain.id = distribution.protein_domain_id"+
      " JOIN resource ON protein_domain.resource_id = resource.id" + 
      " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
      " WHERE (resource.type='clan' OR resource.type='pfam') AND clan_membership.clan_acc IS NULL" +
      " AND assignment.taxonomy_id IN (" + ids + ");";
    } else {
      sql = "SELECT " + columns + " FROM assignment" +
      " JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
      " JOIN distribution ON protein_domain.id = distribution.protein_domain_id"+
      " JOIN resource ON protein_domain.resource_id = resource.id" + 
      " WHERE resource.type=?"+
      " AND assignment.taxonomy_id IN (" + ids + ");";
    }
      return db.query(sql, [type], callback);

  });


 
},

getAccByResourceTypeAndTaxonomyId: function(type, id, callback) { 
  columns = "DISTINCT protein_domain.acc";
  id_like = '"%;' +id+ ';%"';
  id_like2 = '"' +id+ ';%"'; //Before root e.g., Bacteria, archaea, eukaryota, viruses etc..

  sql = "SELECT DISTINCT id FROM taxonomy WHERE (full_taxonomy_id LIKE " + id_like + 
  " OR full_taxonomy_id LIKE "+id_like2 + ")" +
  " AND (rank = 'species' OR rank = 'no rank')";
  var ids_arr = []
  db.query(sql, function (err, rows) {
    if (err) {
      throw err;
    } else {
      for (var i of rows) {
        var string = JSON.stringify(i);
        var json =  JSON.parse(string);
        ids_arr.push(json.id);
      }
    }

    var ids = ids_arr.join(',');
    var bytes = lengthInUtf8Bytes(ids);
    if (ids_arr.length == 0 || bytes > 3000000) {
      ids = sql; // SLOWER
    } 
    if (type == 'clanpfam') {
      sql = "SELECT " + columns + " FROM assignment" +
      " JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
      " JOIN resource ON protein_domain.resource_id = resource.id" + 
      " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
      " WHERE (resource.type='clan' OR resource.type='pfam') AND clan_membership.clan_acc IS NULL" +
      " AND assignment.taxonomy_id IN (" + ids + ");";
    } else {
      sql = "SELECT " + columns + " FROM assignment" +
      " JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
      " JOIN resource ON protein_domain.resource_id = resource.id" + 
      " WHERE resource.type=?"+
      " AND assignment.taxonomy_id IN (" + ids + ");";
    }
      return db.query(sql, [type], callback);
  });


 
}
};  
module.exports = Assignment;