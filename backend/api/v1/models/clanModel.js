var db = require('../dbconnection');

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

var Clan = {  
	getClanByPfamAcc: function(acc,version, callback) {  
		db.sqlQuery("SELECT clan_acc FROM clan_membership WHERE pfam_acc=? AND clan_membership.version=? LIMIT 1", [acc, version], callback);  
  },

};  
module.exports = Clan;