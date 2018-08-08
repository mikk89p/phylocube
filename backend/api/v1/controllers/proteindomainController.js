var ProteinDomain = require('../models/proteindomainModel');
var BaseController = require('./baseController');


exports.getProteinDomainByAcc = function(req, res, next) {  
	if (req.params.acc) {  
		ProteinDomain.getByAcc(req.params.acc, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection); 
		});  
	} else {  
		ProteinDomain.getAll(function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection); 
		});}   
};  

exports.getProteinDomainWithDistributionByAcc = function(req, res, next) {  
	if (req.params.acc) {  
		ProteinDomain.getProteinDomainWithDistributionByAcc(req.params.acc, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection); 
		});  
	} 
};

exports.getDataByResourceType = function(req, res, next) {  
	if (req.params.type) {  
		ProteinDomain.getDataByResourceType(req.params.type, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection);
		});  
	} 
};

exports.getDataWithDistributionByResourceType = function(req, res, next) {  
	if (req.params.type) {  
		ProteinDomain.getDataWithDistributionByResourceType(req.params.type, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection); 
		});  
	} 
};


