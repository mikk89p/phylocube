module.exports = function(app) {
  var proteinDomainController = require('../controllers/proteindomainController');

	// Routes
	app.route('/proteindomain/:id?').get(proteinDomainController.getProteinDomain)
	app.route('/proteindomain/summary/:id?').get(proteinDomainController.getProteinDomainSummary)
	app.route('/proteindomain/resource/:id?').get(proteinDomainController.getAllProteinDomainsByResourceId)
	app.route('/proteindomain/resource/summary/:id?').get(proteinDomainController.getAllProteinDomainsSummaryByResource)
	
};