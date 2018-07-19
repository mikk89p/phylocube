var db = require('../dbconnection');

var Taxonomy = {  
	getAll: function(callback) {  
		db.sqlQuery("SELECT * FROM taxonomy",[] , callback);  
	},
	getById: function(id, callback) {  
		db.sqlQuery("SELECT * FROM taxonomy WHERE id=?", [id], callback);  
  },

  getByIdLike: function(id, callback) {  
		db.sqlQuery("SELECT * FROM taxonomy WHERE id LIKE ? LIMIT 100", ['%'+id+'%'], callback);  
  },

  getByNameLike: function(name, callback) {  
		db.sqlQuery("SELECT * FROM taxonomy WHERE name LIKE ? LIMIT 100", ['%'+name+'%'], callback);  
  },

  getByNameLikeOrId: function(query, callback) {  
		db.sqlQuery("SELECT id, name FROM taxonomy WHERE name LIKE ? OR id LIKE ? LIMIT 100", ['%'+query+'%',query], callback);  
	},
  
  getByNameOrIdLike: function(query, callback) {  
		db.sqlQuery("SELECT id, name FROM taxonomy WHERE name LIKE ? OR id LIKE ? LIMIT 100", ['%'+query+'%','%'+query+'%'], callback);  
	}
};  
module.exports = Taxonomy;