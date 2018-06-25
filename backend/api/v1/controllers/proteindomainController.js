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


exports.getProteinDomainByAcc = function(req, res, next) {  
	if (req.params.acc) {  
		proteinDomain.getByAcc(req.params.acc, function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});  
	} else {  
		proteinDomain.getAll(function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});}   
};  

exports.getProteinDomainWithDistributionByAcc = function(req, res, next) {  
	if (req.params.acc) {  
		proteinDomain.getProteinDomainWithDistributionByAcc(req.params.acc, function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});  
	} 
};

exports.getAllProteinDomainsByResourceType = function(req, res, next) {  
	if (req.params.type) {  
		proteinDomain.getAllProteinDomainsByResourceType(req.params.type, function(err, rows) { 
			sendDefaultResponse(res, err, rows);
		});  
	} 
};

exports.getAllProteinDomainsWithDistributionByResourceType = function(req, res, next) {  
	if (req.params.type) {  
		proteinDomain.getAllProteinDomainsWithDistributionByResourceType(req.params.type, function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});  
	} 
};