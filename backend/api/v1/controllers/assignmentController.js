var Assignment = require('../models/assignmentModel')

function sendDefaultResponse(res, err, data){
	if (err) {
		//Service not available
		res.statusCode = 503;
		res.send(err);
	}
	res.statusCode = 200;
	res.json(data);
}

exports.getAssignment = function(req, res, next) {  
	if (req.params.id) {  
		Assignment.getById(req.params.id, function(err, rows) {  
			sendDefaultResponse(res, err, rows);  
		});  
	} else {  
		Assignment.getAll(function(err, rows) {  
			sendDefaultResponse(res, err, rows);  
		});  
	}  
};  