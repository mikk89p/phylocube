var Assignment = require('../models/assignmentModel');
var BaseController = require('./baseController');



exports.getAssignmentByAcc = function(req, res, next) {  
	if (req.params.acc) {  
		Assignment.getByAcc(req.params.acc, function(err, rows, dbConnection) {  
			BaseController.sendDefaultResponse(res, err, rows, dbConnection);  
		});  
	} else {  
		Assignment.getAll(function(err, rows, dbConnection) {  
			BaseController.sendDefaultResponse(res, err, rows, dbConnection);  
		});  
	}  
};  

exports.getDataWithDistributionByResourceTypeAndTaxonomyId = function(req, res, next) {  
	if (req.params.type && req.params.id) {  
		Assignment.getDataWithDistributionByResourceTypeAndTaxonomyId(req.params.type, req.params.id, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection); 
		});  
	} 
};

exports.getDataByResourceTypeAndTaxonomyId = function(req, res, next) {  
	if (req.params.type && req.params.id) {  
		Assignment.getDataByResourceTypeAndTaxonomyId(req.params.type, req.params.id, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection); 
		});  
	} 
};

exports.getAccByResourceTypeAndTaxonomyId = function(req, res, next) {  
	if (req.params.type && req.params.id) {  
		Assignment.getAccByResourceTypeAndTaxonomyId(req.params.type, req.params.id, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection); 
		});  
	} 
};