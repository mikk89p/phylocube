var db = require('../dbconnection');

var Resource = {
  getAll: function (callback) {
    db.sqlQuery("SELECT * FROM resource", [], callback);
  },
  getByType: function (type, version, callback) {
    db.sqlQuery("SELECT * FROM resource WHERE type=? AND version=?", [type, version], callback);
  }
};
module.exports = Resource;