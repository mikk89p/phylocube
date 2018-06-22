var proteinDomain = require('../models/proteindomainModel')



function sendDefaultResponse(res, err, data){
	if (err) {
		//Service not available
		res.statusCode = 503;
		res.send(err);
	}
	res.statusCode = 200;
	res.json(data);
}



exports.getProteinDomain = function(req, res, next) {  
	if (req.params.id) {  
		proteinDomain.getById(req.params.id, function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});  
	} else {  
		proteinDomain.getAll(function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});}   
};  

exports.getProteinDomainSummary = function(req, res, next) {  
	if (req.params.id) {  
		proteinDomain.getProteinDomainSummaryById(req.params.id, function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});  
	} 
};

exports.getAllProteinDomainsByResourceId = function(req, res, next) {  
	if (req.params.id) {  
		proteinDomain.getAllProteinDomainsByResourceId(req.params.id, function(err, rows) { 
			sendDefaultResponse(res, err, rows);
		});  
	} 
};

exports.getAllProteinDomainsSummaryByResource = function(req, res, next) {  
	if (req.params.id) {  
		proteinDomain.getAllProteinDomainsSummaryByResourceId(req.params.id, function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});  
	} 
};