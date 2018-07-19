var Resource = require('../models/resourceModel');
var BaseController = require('./baseController');


exports.getResource = function(req, res) {  
	if (req.params.type) {  
		Resource.getByType(req.params.type, function(err, rows) {  
			BaseController.sendDefaultResponse(res, err, rows);  
		});  
	} else {  
		Resource.getAll(function(err, rows) {  
			BaseController.sendDefaultResponse(res, err, rows);  
		});  
	}  
};  