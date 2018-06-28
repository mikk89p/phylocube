var Taxonomy = require('../models/taxonomyModel')

function sendDefaultResponse(res, err, data){
	if (err) {
		//Service not available
		res.statusCode = 503;
		res.send(err);
	}
	res.statusCode = 200;
	res.json(data);
}

exports.getTaxonByTaxonomyId = function(req, res, next) {  
	if (req.params.id) {  
		Taxonomy.getById(req.params.id, function(err, rows) {  
			sendDefaultResponse(res, err, rows);  
		});  
	} else {  
		Taxonomy.getAll(function(err, rows) {  
			sendDefaultResponse(res, err, rows);  
		});  
	}  
};  

exports.getTaxonByIdLike = function(req, res, next) {  
	if (req.params.id) {  
		Taxonomy.getByIdLike(req.params.id, function(err, rows) { 
			sendDefaultResponse(res, err, rows);
    });  
  }
};

exports.getTaxonByNameLike = function(req, res, next) {  
	if (req.params.name) {  
		Taxonomy.getByNameLike(req.params.name, function(err, rows) { 
			sendDefaultResponse(res, err, rows);
		});  
	} 
};

