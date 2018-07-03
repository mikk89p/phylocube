module.exports = function(app) {
  
  // API REST END POINTS
  // https://docs.spring.io/spring-data/jpa/docs/current/reference/html/
  // Resources
	var resourceController = require('./controllers/resourceController');
	app.route('/v1/resource/:type?').get(resourceController.getResource);

	//Taxonomy Routes
  var taxonomyController = require('./controllers/taxonomyController');
  app.route('/v1/taxonomy/:id?').get(taxonomyController.getTaxonByTaxonomyId);
  app.route('/v1/taxonomy/idlike/:id?').get(taxonomyController.getTaxonByIdLike);
  app.route('/v1/taxonomy/namelike/:name?').get(taxonomyController.getTaxonByNameLike);
  app.route('/v1/taxonomy/nameorid/:query?').get(taxonomyController.getTaxonByNameOrIdLike)
  
	
	// Protein domain Routes
  var proteinDomainController = require('./controllers/proteindomainController');
	app.route('/v1/proteindomain/:acc?').get(proteinDomainController.getProteinDomainByAcc)
	app.route('/v1/proteindomain/:acc?/distribution').get(proteinDomainController.getProteinDomainWithDistributionByAcc)
	app.route('/v1/proteindomain/resource/:type?').get(proteinDomainController.getAllProteinDomainsByResourceType)
	app.route('/v1/proteindomain/distribution/resource/:type?').get(proteinDomainController.getAllProteinDomainsWithDistributionByResourceType)

 // Assignment routes
	var assignmentController = require('./controllers/assignmentController');
  app.route('/v1/assignment/:acc?').get(assignmentController.getAssignmentByAcc)
  app.route('/v1/assignment/proteindomain/distribution/resource/:type?/taxonomy/:id?').get(assignmentController.getByResourceTypeAndTaxonomyId)
	
};