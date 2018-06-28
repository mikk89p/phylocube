var db = require('../dbconnection');

var Taxonomy = {  
	getAll: function(callback) {  
			return db.query("SELECT * FROM taxonomy", callback);  
	},
	getById: function(id, callback) {  
		return db.query("SELECT * FROM taxonomy WHERE id=?", [id], callback);  
  },

  getByIdLike: function(id, callback) {  
		return db.query("SELECT * FROM taxonomy WHERE id LIKE ?", ['%'+id+'%'], callback);  
  },

  getByNameLike: function(name, callback) {  
		return db.query("SELECT * FROM taxonomy WHERE name LIKE ? ", ['%'+name+'%'], callback);  
	}
};  
module.exports = Taxonomy;