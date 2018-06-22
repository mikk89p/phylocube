module.exports = function(app) {
  
	// Resource Routes
	var resourceController = require('./controllers/resourceController');
	app.route('/resource/:id?').get(resourceController.getResource)

	//Taxonomy Routes
	var taxonomyController = require('./controllers/taxonomyController');
  app.route('/taxonomy/:id?').get(taxonomyController.getTaxon)
	
	// Protein domain Routes
  var proteinDomainController = require('./controllers/proteindomainController');
	app.route('/proteindomain/:id?').get(proteinDomainController.getProteinDomain)
	app.route('/proteindomain/summary/:id?').get(proteinDomainController.getProteinDomainSummary)
	app.route('/proteindomain/resource/:id?').get(proteinDomainController.getAllProteinDomainsByResourceId)
	app.route('/proteindomain/resource/summary/:id?').get(proteinDomainController.getAllProteinDomainsSummaryByResource)
	
	//Taxonomy Routes
	var assignmentController = require('./controllers/assignmentController');
  app.route('/assignment/:id?').get(assignmentController.getAssignment)
};