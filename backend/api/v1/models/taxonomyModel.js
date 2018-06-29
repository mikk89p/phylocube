var db = require('../dbconnection');

var Taxonomy = {  
	getAll: function(callback) {  
			return db.query("SELECT * FROM taxonomy", callback);  
	},
	getById: function(id, callback) {  
		return db.query("SELECT * FROM taxonomy WHERE id=?", [id], callback);  
  },

  getByIdLike: function(id, callback) {  
		return db.query("SELECT * FROM taxonomy WHERE id LIKE ? LIMIT 100", ['%'+id+'%'], callback);  
  },

  getByNameLike: function(name, callback) {  
		return db.query("SELECT * FROM taxonomy WHERE name LIKE ? LIMIT 100", ['%'+name+'%'], callback);  
  },
  
  getByNameOrIdLike: function(query, callback) {  
		return db.query("SELECT id, name FROM taxonomy WHERE name LIKE ? OR id LIKE ? LIMIT 100", ['%'+query+'%','%'+query+'%'], callback);  
	}
};  
module.exports = Taxonomy;