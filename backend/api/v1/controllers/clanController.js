var Clan = require('../models/clanModel')

function sendDefaultResponse(res, err, data){
	if (err) {
		//Service not available
		res.statusCode = 503;
		res.send(err);
	}
	res.statusCode = 200;
	res.json(data);
}
 

exports.getClanByPfamAcc = function(req, res, next) {  
	if (req.params.pfam ) {  
		Clan.getClanByPfamAcc(req.params.pfam, function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});  
	} 
};