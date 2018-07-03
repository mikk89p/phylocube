var ProteinDomain = require('../models/proteindomainModel')


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
		ProteinDomain.getByAcc(req.params.acc, function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});  
	} else {  
		ProteinDomain.getAll(function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});}   
};  

exports.getProteinDomainWithDistributionByAcc = function(req, res, next) {  
	if (req.params.acc) {  
		ProteinDomain.getProteinDomainWithDistributionByAcc(req.params.acc, function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});  
	} 
};

exports.getAllProteinDomainsByResourceType = function(req, res, next) {  
	if (req.params.type) {  
		ProteinDomain.getAllProteinDomainsByResourceType(req.params.type, function(err, rows) { 
			sendDefaultResponse(res, err, rows);
		});  
	} 
};

exports.getAllProteinDomainsWithDistributionByResourceType = function(req, res, next) {  
	if (req.params.type) {  
		ProteinDomain.getAllProteinDomainsWithDistributionByResourceType(req.params.type, function(err, rows) { 
			sendDefaultResponse(res, err, rows); 
		});  
	} 
};


