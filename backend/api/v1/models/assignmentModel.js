var db = require('../dbconnection');


const bytes_limit = 2000000;

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}


var Assignment = {  
	getAll: function(callback) {  
    db.sqlQuery("SELECT * FROM assignment", [], callback); 
	},
	getByAcc: function(acc, callback) {  
		db.sqlQuery("SELECT * FROM assignment JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id WHERE protein_domain.acc=?", [acc], callback);  

  },
/*
 TODO  - Maybe use RECURSIVE
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


 getDataWithDistributionByResourceTypeAndTaxonomyId: function(type, id, callback) { 
  // First query all taxonomy IDs
  // max_allowed_packet 4194304
  var columns = "DISTINCT protein_domain.acc,protein_domain.description,protein_domain.classification,archaea,bacteria,eukaryota,virus,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes";

  var ids_sub_query = "SELECT DISTINCT id FROM taxonomy WHERE (id = ? OR full_taxonomy_id LIKE ? OR full_taxonomy_id LIKE ? )" +
  " AND (rank = 'species' OR rank = 'no rank')";
  var ids_arr = []
  db.sqlQuery(ids_sub_query, [id, '%;' +id+ ';%', id+ ';%'], function (err, rows, dbConnection) {
    console.log('Release connection threadId:', dbConnection.threadId);
    dbConnection.release(); // release subquery connection to the pool
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
    if (ids_arr.length == 0 || bytes > bytes_limit) {
      ids = ids_sub_query; // SLOWER
    } 

    var sql = ""
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
      db.sqlQuery(sql, [type, id, '%;' +id+ ';%', id+ ';%'], callback);

  });
},



getDataByResourceTypeAndTaxonomyId: function(type, id, callback) {
   var columns = "protein_domain.acc, protein_domain.description,protein_domain.classification, count(DISTINCT assignment.taxonomy_id) as count";
   var sql = "SELECT DISTINCT id FROM taxonomy WHERE (id = ? OR full_taxonomy_id LIKE ? OR full_taxonomy_id LIKE ? )" +
   " AND (rank = 'species' OR rank = 'no rank')";
   var ids_arr = []
   db.sqlQuery(sql, [id, '%;' +id+ ';%', id+ ';%'], function (err, rows, dbConnection) {

    console.log('Release connection threadId:', dbConnection.threadId);
    dbConnection.release(); // release subquery connection to the pool

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
     if (ids_arr.length == 0 || bytes > bytes_limit) {
       // console.log('Limit reached');
       ids = sql; 
     } 
    
     if (type == 'clanpfam') {
       sql = "SELECT " + columns +
       " FROM (SELECT * FROM assignment WHERE assignment.taxonomy_id IN (" + ids + ")) AS assignment" +
       " INNER JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
       " INNER JOIN resource ON protein_domain.resource_id = resource.id" + 
       " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
       " WHERE (resource.type='clan' OR resource.type='pfam') AND clan_membership.clan_acc IS NULL" +
       " GROUP BY protein_domain.acc";
     } else {
       sql = "SELECT " + columns +
       " FROM (SELECT * FROM assignment WHERE assignment.taxonomy_id IN (" + ids + ")) AS assignment" +
       " INNER JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
       " INNER JOIN resource ON protein_domain.resource_id = resource.id" + 
       " WHERE resource.type=? GROUP BY protein_domain.acc";
     }
 
     if (ids_arr.length == 0 || bytes > bytes_limit) {
       db.sqlQuery(sql, [ id, '%;' +id+ ';%', id+ ';%', type], callback);
     } else {
      db.sqlQuery(sql, [type], callback);
     }

   });
 },


 getDataByResourceTypeAndTaxonomyIdold: function(type, id, callback) {
    
      var columns = "protein_domain.acc, protein_domain.description,protein_domain.classification, count(DISTINCT assignment.taxonomy_id) as count";
      var ids_sub_query = "SELECT DISTINCT id FROM taxonomy WHERE (id = ? OR full_taxonomy_id LIKE ? OR full_taxonomy_id LIKE ? )" +
      " AND (rank = 'species' OR rank = 'no rank')";

        if (type == 'clanpfam') {
          sql = "SELECT " + columns +
          " FROM (SELECT * FROM assignment WHERE assignment.taxonomy_id IN (" + ids_sub_query + ")) AS assignment" +
          " INNER JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
          " INNER JOIN resource ON protein_domain.resource_id = resource.id" + 
          " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
          " WHERE (resource.type='clan' OR resource.type='pfam') AND clan_membership.clan_acc IS NULL" +
          " GROUP BY protein_domain.acc";
        } else {
          sql = "SELECT " + columns + " FROM assignment" +
          " INNER JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
          " INNER JOIN resource ON protein_domain.resource_id = resource.id" + 
          " WHERE resource.type=?"+
          " AND assignment.taxonomy_id IN (" + ids_sub_query + ") GROUP BY protein_domain.acc;";
        }

        db.sqlQuery(sql, [ type, id, '%;' +id+ ';%', id+ ';%' ], callback);   
    },

    getAccByResourceTypeAndTaxonomyId: function(type, id, callback) { 

          var columns = "DISTINCT protein_domain.acc";
          var sql = "SELECT DISTINCT id FROM taxonomy WHERE (id = ? OR full_taxonomy_id LIKE ? OR full_taxonomy_id LIKE ?)" +
          " AND (rank = 'species' OR rank = 'no rank')";
          var ids_arr = []
          db.sqlQuery(sql, [id, '%;' +id+ ';%', id + ';%'], function (err, rows, dbConnection) {
            
            console.log('Release connection threadId:', dbConnection.threadId);
            dbConnection.release(); // release subquery connection to the pool
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
            if (ids_arr.length == 0 || bytes > bytes_limit) {
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
            db.sqlQuery(sql, [type, id, '%;' +id+ ';%', id + ';%'], callback);
          });
    }
};  
module.exports = Assignment;