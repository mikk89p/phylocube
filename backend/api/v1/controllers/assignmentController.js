var Assignment = require('../models/assignmentModel');
var BaseController = require('./baseController');



exports.getAssignmentByAcc = function(req, res, next) {  
	if (req.params.acc) {  
		Assignment.getByAcc(req.params.acc, function(err, rows) {  
			BaseController.sendDefaultResponse(res, err, rows);  
		});  
	} else {  
		Assignment.getAll(function(err, rows) {  
			BaseController.sendDefaultResponse(res, err, rows);  
		});  
	}  
};  

exports.getDataWithDistributionByResourceTypeAndTaxonomyId = function(req, res, next) {  
	if (req.params.type && req.params.id) {  
		Assignment.getDataWithDistributionByResourceTypeAndTaxonomyId(req.params.type, req.params.id, function(err, rows) { 
			BaseController.sendDefaultResponse(res, err, rows); 
		});  
	} 
};

exports.getDataByResourceTypeAndTaxonomyId = function(req, res, next) {  
	if (req.params.type && req.params.id) {  
		Assignment.getDataByResourceTypeAndTaxonomyId(req.params.type, req.params.id, function(err, rows) { 
      console.log('end : ', req.params.id, new Date() );
			BaseController.sendDefaultResponse(res, err, rows); 
		});  
	} 
};

exports.getAccByResourceTypeAndTaxonomyId = function(req, res, next) {  
	if (req.params.type && req.params.id) {  
		Assignment.getAccByResourceTypeAndTaxonomyId(req.params.type, req.params.id, function(err, rows) { 
      console.log('end : ', req.params.id, new Date() );
			BaseController.sendDefaultResponse(res, err, rows); 
		});  
	} 
};