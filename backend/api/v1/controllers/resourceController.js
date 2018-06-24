var Resource = require('../models/resourceModel')

function sendDefaultResponse(res, err, data){
	if (err) {
		//Service not available
		res.statusCode = 503;
		res.send(err);
	}
	res.statusCode = 200;
	res.json(data);
}

exports.getResource = function(req, res, next) {  
	if (req.params.type) {  
		Resource.getByType(req.params.type, function(err, rows) {  
			sendDefaultResponse(res, err, rows);  
		});  
	} else {  
		Resource.getAll(function(err, rows) {  
			sendDefaultResponse(res, err, rows);  
		});  
	}  
};  