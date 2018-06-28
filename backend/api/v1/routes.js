module.exports = function(app) {
  
	// Resource Routes
	var resourceController = require('./controllers/resourceController');
	app.route('/v1/resource/:type?').get(resourceController.getResource)

	//Taxonomy Routes
  var taxonomyController = require('./controllers/taxonomyController');
  app.route('/v1/taxonomy/:id?').get(taxonomyController.getTaxonByTaxonomyId)
  app.route('/v1/taxonomy/idlike/:id?').get(taxonomyController.getTaxonByIdLike)
  app.route('/v1/taxonomy/namelike/:name?').get(taxonomyController.getTaxonByNameLike)
  
	
	// Protein domain Routes
  var proteinDomainController = require('./controllers/proteindomainController');
	app.route('/v1/proteindomain/:acc?').get(proteinDomainController.getProteinDomainByAcc)
	app.route('/v1/proteindomain/:acc?/distribution').get(proteinDomainController.getProteinDomainWithDistributionByAcc)
	app.route('/v1/proteindomain/resource/:type?').get(proteinDomainController.getAllProteinDomainsByResourceType)
	app.route('/v1/proteindomain/distribution/resource/:type?').get(proteinDomainController.getAllProteinDomainsWithDistributionByResourceType)
	
	//Taxonomy Routes
	var assignmentController = require('./controllers/assignmentController');
  app.route('/v1/assignment/:acc?').get(assignmentController.getAssignmentByAcc)
};