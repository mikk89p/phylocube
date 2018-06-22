var Taxonomy = require('../models/taxonomyModel')

function sendDefaultResponse(res, err, data){
	if (err) {
		//Service not available
		res.statusCode = 503;
		res.send(err);
	}
	res.statusCode = 200;
	res.json(data);
}

exports.getTaxon = function(req, res, next) {  
	if (req.params.id) {  
		Taxonomy.getById(req.params.id, function(err, rows) {  
			sendDefaultResponse(res, err, rows);  
		});  
	} else {  
		Taxonomy.getAll(function(err, rows) {  
			sendDefaultResponse(res, err, rows);  
		});  
	}  
};  