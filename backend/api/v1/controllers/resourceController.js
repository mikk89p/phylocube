var Resource = require('../models/resourceModel')

exports.get = function(req, res, next) {  
	if (req.params.id) {  
		Resource.getResourceById(req.params.id, function(err, rows) {  
					if (err) { 
							//Service not available
							res.statusCode = 503; 
							res.json(err);  
					} else {  
						res.statusCode = 200;
							res.json(rows);  
					}  
			});  
	} else {  
		Resource.getAllResources(function(err, rows) {  
					if (err) {  
							//Service not available
							res.statusCode = 503;
							res.json(err);  
					} else {  
							res.statusCode = 200;
							res.json(rows);  
					}  
			});  
	}  
};  