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

exports.getAssignmentByAcc = function(req, res, next) {  
	if (req.params.acc) {  
		Assignment.getByAcc(req.params.acc, function(err, rows) {  
			sendDefaultResponse(res, err, rows);  
		});  
	} else {  
		Assignment.getAll(function(err, rows) {  
			sendDefaultResponse(res, err, rows);  
		});  
	}  
};  