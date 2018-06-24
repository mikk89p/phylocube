module.exports = function(app) {
  
	// Resource Routes
	var resourceController = require('./controllers/resourceController');
	app.route('/v1/resource/:type?').get(resourceController.getResource)

	//Taxonomy Routes
	var taxonomyController = require('./controllers/taxonomyController');
  app.route('/v1/taxonomy/:id?').get(taxonomyController.getTaxon)
	
	// Protein domain Routes
  var proteinDomainController = require('./controllers/proteindomainController');
	app.route('/v1/proteindomain/:id?').get(proteinDomainController.getProteinDomain)
	app.route('/v1/proteindomain/summary/:id?').get(proteinDomainController.getProteinDomainSummary)
	app.route('/v1/proteindomain/resource/:id?').get(proteinDomainController.getAllProteinDomainsByResourceId)
	app.route('/v1/proteindomain/resource/summary/:id?').get(proteinDomainController.getAllProteinDomainsSummaryByResource)
	
	//Taxonomy Routes
	var assignmentController = require('./controllers/assignmentController');
  app.route('/v1/assignment/:id?').get(assignmentController.getAssignment)
};