var Clan = require('../models/clanModel');
var BaseController = require('./baseController');
 

exports.getClanByPfamAcc = function(req, res) {  
	if (req.params.pfam ) {  
		Clan.getClanByPfamAcc(req.params.pfam, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection); 
		});  
	} 
};