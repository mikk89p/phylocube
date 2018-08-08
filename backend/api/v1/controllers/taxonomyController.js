var Taxonomy = require('../models/taxonomyModel')
var BaseController = require('./baseController');

exports.getTaxonByTaxonomyId = function(req, res, next) {  
	if (req.params.id) {  
		Taxonomy.getById(req.params.id, function(err, rows, dbConnection) {  
			BaseController.sendDefaultResponse(res, err, rows, dbConnection);  
		});  
	} else {  
		Taxonomy.getAll(function(err, rows, dbConnection) {  
			BaseController.sendDefaultResponse(res, err, rows, dbConnection);  
		});  
	}  
};  

exports.getTaxonByIdLike = function(req, res, next) {  
	if (req.params.id) {  
		Taxonomy.getByIdLike(req.params.id, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection);
    });  
  }
};

exports.getTaxonByNameLike = function(req, res, next) {  
	if (req.params.name) {  
		Taxonomy.getByNameLike(req.params.name, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection);
		});  
	} 
};

exports.getTaxonByNameOrIdLike = function(req, res, next) {  
	if (req.params.query) {  
		Taxonomy.getByNameOrIdLike(req.params.query, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection);
		});  
	} 
};

exports.getTaxonByNameLikeOrId = function(req, res, next) {  
	if (req.params.query) {  
		Taxonomy.getByNameLikeOrId(req.params.query, function(err, rows, dbConnection) { 
			BaseController.sendDefaultResponse(res, err, rows, dbConnection);
		});  
	} 
};

