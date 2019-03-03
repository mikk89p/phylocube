var db = require('../dbconnection');
var helper = require('../models/helperModel');


const bytes_limit = 10000000; // Improves performance



function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

function clearString(str) {
  return str.replace(/[^a-zA-Z1-9 ]/g, "");
}


var Assignment = {
  getAll: function (callback) {
    db.sqlQuery("SELECT * FROM pfam_assignment UNION ALL SELECT * FROM clan_assignment UNION ALL SELECT * FROM supfam_assignment UNION ALL SELECT * FROM gene3d_assignment", [], callback);
  },
  getByAcc: function (acc, type, version, callback) {
    type = clearString(type);
    db.sqlQuery("SELECT * FROM " + type + "_assignment JOIN protein_domain ON protein_domain_id = protein_domain.id JOIN resource ON protein_domain.resource_id = resource.id WHERE protein_domain.acc=? AND resource.version=?", [acc, version], callback);

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

 getDataWithDistributionByResourceTypeAndTaxonomyId: function (type, id, version, callback) {

  type = clearString(type);
  var columns = "DISTINCT protein_domain.acc,protein_domain.description,protein_domain.classification,archaea,bacteria,eukaryota,virus,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes";

  var subquery = "SELECT DISTINCT id FROM taxonomy WHERE (id = ? OR parent_id=? OR full_taxonomy_id LIKE ? OR full_taxonomy_id LIKE ?)" +
    " AND (rank = 'species' OR rank = 'no rank')";

    
  if (type == 'clanpfam') {
    sql = "SELECT " + columns +" FROM (SELECT taxonomy_id, protein_domain_id FROM pfam_assignment" +
    " INNER JOIN ("+subquery+") AS taxonomy ON taxonomy_id=taxonomy.id) AS assignment" +
    " INNER JOIN protein_domain ON protein_domain_id = protein_domain.id" +
    " JOIN resource ON protein_domain.resource_id = resource.id" +
    " JOIN distribution ON protein_domain.id = distribution.protein_domain_id" +
    " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
    " WHERE resource.version=? AND clan_membership.clan_acc IS NULL" + 
    " UNION ALL " +
    " SELECT " + columns +" FROM (SELECT taxonomy_id, protein_domain_id FROM clan_assignment" +
    " INNER JOIN ("+subquery+") AS taxonomy ON taxonomy_id=taxonomy.id) AS assignment" +
    " INNER JOIN protein_domain ON protein_domain_id = protein_domain.id" +
    " JOIN resource ON protein_domain.resource_id = resource.id" +
    " JOIN distribution ON protein_domain.id = distribution.protein_domain_id" +
    " WHERE resource.version=?";
    db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%', version ,id, id, '%;' + id + ';%', id + ';%', version], callback);
  } else {
    sql = "SELECT " + columns +
    " FROM (SELECT taxonomy_id, protein_domain_id, frequency,e_val FROM " + type + "_assignment" +
    " INNER JOIN ("+subquery+") AS taxonomy ON taxonomy_id=taxonomy.id) AS assignment" +
    " JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
    " JOIN distribution ON protein_domain.id = distribution.protein_domain_id" +
    " JOIN resource ON protein_domain.resource_id = resource.id" +
    " WHERE resource.type=? AND resource.version=? ";
    db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%', type, version], callback);
  }
},

  // Working method but complex
  getDataWithDistributionByResourceTypeAndTaxonomyId2: function (type, id, version, callback) {
    // First query all taxonomy IDs
    // max_allowed_packet 4194304
    type = clearString(type);
    var columns = "DISTINCT protein_domain.acc,protein_domain.description,protein_domain.classification,archaea,bacteria,eukaryota,virus,archaea_genomes,bacteria_genomes,eukaryota_genomes,virus_genomes";

    var ids_sub_query = "SELECT DISTINCT id FROM taxonomy WHERE (id = ? OR parent_id=? OR full_taxonomy_id LIKE ? OR full_taxonomy_id LIKE ? )" +
      " AND (rank = 'species' OR rank = 'no rank')";
    var ids_arr = []
    db.sqlQuery(ids_sub_query, [id, id, '%;' + id + ';%', id + ';%'], function (err, rows, dbConnection) {
      // console.log('Release connection threadId:', dbConnection.threadId);
      dbConnection.release(); // release subquery connection to the pool

      if (err) {
        throw err;
      } else {
        for (var i of rows) {
          var string = JSON.stringify(i);
          var json = JSON.parse(string);
          ids_arr.push(json.id);
        }
      }
      var ids = ids_arr.join(',');
      var bytes = lengthInUtf8Bytes(ids);
      if (ids_arr.length == 0 || bytes * 2 > bytes_limit) {
        ids = ids_sub_query; // SLOWER
      }
      var sql = ""
      if (type == 'clanpfam') {
        /*sql = "SELECT " + columns + " FROM pfam_assignment" +
          " JOIN protein_domain ON protein_domain_id = protein_domain.id" +
          " JOIN distribution ON protein_domain.id = distribution.protein_domain_id" +
          " JOIN resource ON protein_domain.resource_id = resource.id" +
          " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
          " WHERE resource.version=? AND clan_membership.clan_acc IS NULL" +
          " AND taxonomy_id IN (" + ids + ")" + 
          " UNION ALL SELECT " + columns + " FROM clan_assignment" +
          " JOIN protein_domain ON protein_domain_id = protein_domain.id" +
          " JOIN distribution ON protein_domain.id = distribution.protein_domain_id" +
          " JOIN resource ON protein_domain.resource_id = resource.id" +
          " WHERE resource.version=?" +
          " AND taxonomy_id IN (" + ids + ");"*/

        sql = "SELECT " + columns +
          " FROM (SELECT * FROM pfam_assignment WHERE taxonomy_id IN (" + ids + ") UNION ALL SELECT * FROM clan_assignment WHERE taxonomy_id IN (" + ids + ")) AS assignment" +
          " JOIN protein_domain ON protein_domain_id = protein_domain.id" +
          " JOIN distribution ON protein_domain.id = distribution.protein_domain_id" +
          " JOIN resource ON protein_domain.resource_id = resource.id" +
          " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
          " WHERE resource.version=? AND clan_membership.clan_acc IS NULL";

        if (ids_arr.length == 0 || bytes > bytes_limit) {
          db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%', id, id, '%;' + id + ';%', id + ';%', version], callback);
        } else {
          db.sqlQuery(sql, [version, version], callback);
        }


      } else {
        sql = "SELECT " + columns + " FROM " + type + "_assignment" +
          " JOIN protein_domain ON protein_domain_id = protein_domain.id" +
          " JOIN distribution ON protein_domain.id = distribution.protein_domain_id" +
          " JOIN resource ON protein_domain.resource_id = resource.id" +
          " WHERE resource.version=?" +
          " AND " + type + "_assignment.taxonomy_id IN (" + ids + ");";
        db.sqlQuery(sql, [version, id, '%;' + id + ';%', id + ';%'], callback);
      }

    });
  },

  getDataByResourceTypeAndTaxonomyId: function (type, id, version, callback) {

    type = clearString(type);
    var columns = "protein_domain.acc, protein_domain.description,protein_domain.classification, count(DISTINCT taxonomy_id) as count";
    var subquery = "SELECT DISTINCT id FROM taxonomy WHERE (id = ?  OR parent_id=? OR full_taxonomy_id LIKE ? OR full_taxonomy_id LIKE ? )" +
      " AND (rank = 'species' OR rank = 'no rank')";

    if (type == 'clanpfam') {
        sql = "SELECT " + columns +" FROM (SELECT taxonomy_id, protein_domain_id FROM pfam_assignment" +
        " INNER JOIN ("+subquery+") AS taxonomy ON taxonomy_id=taxonomy.id) AS assignment" +
        " INNER JOIN protein_domain ON protein_domain_id = protein_domain.id" +
        " JOIN resource ON protein_domain.resource_id = resource.id" +
        " JOIN distribution ON protein_domain.id = distribution.protein_domain_id" +
        " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
        " WHERE resource.version=? AND clan_membership.clan_acc IS NULL GROUP BY protein_domain.acc" + 
        " UNION ALL " +
        " SELECT " + columns +" FROM (SELECT taxonomy_id, protein_domain_id FROM clan_assignment" +
        " INNER JOIN ("+subquery+") AS taxonomy ON taxonomy_id=taxonomy.id) AS assignment" +
        " INNER JOIN protein_domain ON protein_domain_id = protein_domain.id" +
        " JOIN resource ON protein_domain.resource_id = resource.id" +
        " JOIN distribution ON protein_domain.id = distribution.protein_domain_id" +
        " WHERE resource.version=? GROUP BY protein_domain.acc";
        db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%', version ,id, id, '%;' + id + ';%', id + ';%', version], callback);
      } else {
        sql = "SELECT " + columns +
        " FROM (SELECT taxonomy_id, protein_domain_id, frequency,e_val FROM " + type + "_assignment" +
        " INNER JOIN ("+subquery+") AS taxonomy ON taxonomy_id=taxonomy.id) AS assignment" +
        " JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
        " JOIN resource ON protein_domain.resource_id = resource.id" +
        " WHERE resource.type=? AND resource.version=? GROUP BY protein_domain.acc";
        db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%', type, version], callback);
      }

  },

  // Working method but complex
  getDataByResourceTypeAndTaxonomyId2: function (type, id, version, callback) {
    type = clearString(type);
    var columns = "protein_domain.acc, protein_domain.description,protein_domain.classification, count(DISTINCT taxonomy_id) as count";
    var sql = "SELECT DISTINCT id FROM taxonomy WHERE (id = ?  OR parent_id=? OR full_taxonomy_id LIKE ? OR full_taxonomy_id LIKE ? )" +
      " AND (rank = 'species' OR rank = 'no rank')";
    var ids_arr = []

    //console.log('Before subQuery', helper.getDateTime());
    db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%'], function (err, rows, dbConnection) {

      //console.log('subQuery result', dbConnection.threadId, helper.getDateTime());
      dbConnection.release(); // release subquery connection to the pool

      if (err) {
        throw err;
      } else {
        for (var i of rows) {
          var string = JSON.stringify(i);
          var json = JSON.parse(string);
          ids_arr.push(json.id);
        }
      }
      var ids = ids_arr.join(',');
      var bytes = lengthInUtf8Bytes(ids);
      if (ids_arr.length == 0 || bytes * 2 > bytes_limit) {
        // console.log('Limit reached');
        ids = sql;
      }
      //console.log('clanpfam connection threadId:', dbConnection.threadId, helper.getDateTime());
      if (type == 'clanpfam') {
        sql = "SELECT " + columns +
          " FROM (SELECT * FROM pfam_assignment WHERE taxonomy_id IN (" + ids + ") " +
          " UNION ALL SELECT * FROM clan_assignment WHERE taxonomy_id IN (" + ids + ")) AS assignment" +
          " INNER JOIN protein_domain ON protein_domain_id = protein_domain.id" +
          " INNER JOIN resource ON protein_domain.resource_id = resource.id" +
          " WHERE resource.version=? GROUP BY protein_domain.acc";
        //console.log(sql);
        if (ids_arr.length == 0 || bytes > bytes_limit) {
          db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%', id, id, '%;' + id + ';%', id + ';%', version], callback);
        } else {
          db.sqlQuery(sql, [version], callback);
        }
      } else {
        sql = "SELECT " + columns +
          " FROM (SELECT * FROM " + type + "_assignment WHERE taxonomy_id IN (" + ids + ")) AS assignment" +
          " INNER JOIN protein_domain ON protein_domain_id = protein_domain.id" +
          " INNER JOIN resource ON protein_domain.resource_id = resource.id" +
          " WHERE resource.version=? GROUP BY protein_domain.acc";

        if (ids_arr.length == 0 || bytes > bytes_limit) {
          db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%', version], callback);
        } else {
          db.sqlQuery(sql, [version], callback);
        }
      }

    });
  },

  getAccByResourceTypeAndTaxonomyId: function (type, id, version, callback) {

    type = clearString(type);
    var subquery = "SELECT DISTINCT id FROM taxonomy WHERE (id = ? OR parent_id=? OR full_taxonomy_id LIKE ? OR full_taxonomy_id LIKE ?)" +
      " AND (rank = 'species' OR rank = 'no rank')";
  
    if (type == 'clanpfam') {
      sql = " SELECT DISTINCT protein_domain.acc FROM (SELECT taxonomy_id, protein_domain_id FROM pfam_assignment" +
      " INNER JOIN ("+subquery+") AS taxonomy ON taxonomy_id=taxonomy.id) AS assignment" +
      " INNER JOIN protein_domain ON protein_domain_id = protein_domain.id" +
      " JOIN resource ON protein_domain.resource_id = resource.id" +
      " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
      " WHERE resource.version=? AND clan_membership.clan_acc IS NULL" + 
      " UNION ALL " +
      " SELECT DISTINCT protein_domain.acc FROM (SELECT taxonomy_id, protein_domain_id FROM clan_assignment" +
      " INNER JOIN ("+subquery+") AS taxonomy ON taxonomy_id=taxonomy.id) AS assignment" +
      " INNER JOIN protein_domain ON protein_domain_id = protein_domain.id" +
      " JOIN resource ON protein_domain.resource_id = resource.id" +
      " WHERE resource.version=?";
      db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%', version ,id, id, '%;' + id + ';%', id + ';%', version], callback);
    } else {
      sql = "SELECT DISTINCT protein_domain.acc" +
      " FROM (SELECT taxonomy_id, protein_domain_id, frequency,e_val FROM " + type + "_assignment" +
      " INNER JOIN ("+subquery+") AS taxonomy ON taxonomy_id=taxonomy.id) AS assignment" +
      " JOIN protein_domain ON assignment.protein_domain_id = protein_domain.id" +
      " JOIN resource ON protein_domain.resource_id = resource.id" +
      " WHERE resource.version=? ";
      db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%', version], callback);
    }
  },

  /* Slow with Fungi | Taxonomy ID: 4751
  getAccByResourceTypeAndTaxonomyId: function (type, id, version, callback) {
    type = clearString(type);
    var columns = "DISTINCT protein_domain.acc";
    var sql = "SELECT DISTINCT id FROM taxonomy WHERE (id = ? OR parent_id=? OR full_taxonomy_id LIKE ? OR full_taxonomy_id LIKE ?)" +
      " AND (rank = 'species' OR rank = 'no rank')";
    var ids_arr = []
    db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%'], function (err, rows, dbConnection) {

      // console.log('Release connection threadId:', dbConnection.threadId);
      dbConnection.release(); // release subquery connection to the pool

      if (err) {
        throw err;
      } else {
        for (var i of rows) {
          var string = JSON.stringify(i);
          var json = JSON.parse(string);
          ids_arr.push(json.id);
        }
      }

      var ids = ids_arr.join(',');
      var bytes = lengthInUtf8Bytes(ids);
      if (ids_arr.length == 0 || bytes * 2 > bytes_limit) {
        ids = sql; // SLOWER
      }
      // console.log('clanpfam connection threadId:', dbConnection.threadId);
      if (type == 'clanpfam') {
        // Used in Search By Taxonomy
        sql = "SELECT " + columns +
          " FROM (SELECT * FROM pfam_assignment WHERE taxonomy_id IN (" + ids + ") UNION ALL SELECT * FROM clan_assignment WHERE taxonomy_id IN (" + ids + ")) AS assignment" +
          " JOIN protein_domain ON protein_domain_id = protein_domain.id" +
          " JOIN resource ON protein_domain.resource_id = resource.id" +
          " LEFT JOIN clan_membership ON protein_domain.acc = clan_membership.pfam_acc " +
          " WHERE resource.version=? AND clan_membership.clan_acc IS NULL";
        if (ids_arr.length == 0 || bytes > bytes_limit) {
          db.sqlQuery(sql, [id, id, '%;' + id + ';%', id + ';%', id, id, '%;' + id + ';%', id + ';%', version], callback);
        } else {
          db.sqlQuery(sql, [version], callback);
        }

      } else {
        sql = "SELECT " + columns + " FROM " + type + "_assignment" +
          " JOIN protein_domain ON " + type + "_assignment.protein_domain_id = protein_domain.id" +
          " JOIN resource ON protein_domain.resource_id = resource.id" +
          " WHERE resource.type=? AND resource.version=?" +
          " AND " + type + "_assignment.taxonomy_id IN (" + ids + ");";

        db.sqlQuery(sql, [type, version, id, id, '%;' + id + ';%', id + ';%'], callback);
      }

    });
  }*/
};
module.exports = Assignment;