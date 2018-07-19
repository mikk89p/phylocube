var Taxonomy = require('../models/taxonomyModel')
var BaseController = require('./baseController');

exports.getTaxonByTaxonomyId = function(req, res, next) {  
	if (req.params.id) {  
		Taxonomy.getById(req.params.id, function(err, rows) {  
			BaseController.sendDefaultResponse(res, err, rows);  
		});  
	} else {  
		Taxonomy.getAll(function(err, rows) {  
			BaseController.sendDefaultResponse(res, err, rows);  
		});  
	}  
};  

exports.getTaxonByIdLike = function(req, res, next) {  
	if (req.params.id) {  
		Taxonomy.getByIdLike(req.params.id, function(err, rows) { 
			BaseController.sendDefaultResponse(res, err, rows);
    });  
  }
};

exports.getTaxonByNameLike = function(req, res, next) {  
	if (req.params.name) {  
		Taxonomy.getByNameLike(req.params.name, function(err, rows) { 
			BaseController.sendDefaultResponse(res, err, rows);
		});  
	} 
};

exports.getTaxonByNameOrIdLike = function(req, res, next) {  
	if (req.params.query) {  
		Taxonomy.getByNameOrIdLike(req.params.query, function(err, rows) { 
			BaseController.sendDefaultResponse(res, err, rows);
		});  
	} 
};

exports.getTaxonByNameLikeOrId = function(req, res, next) {  
	if (req.params.query) {  
		Taxonomy.getByNameLikeOrId(req.params.query, function(err, rows) { 
			BaseController.sendDefaultResponse(res, err, rows);
		});  
	} 
};

