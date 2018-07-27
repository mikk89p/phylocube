module.exports = function(router) {

  // Resources
	var resourceController = require('./controllers/resourceController');
	router.get('/resource/:type?',resourceController.getResource);

	//Taxonomy Routes
  var taxonomyController = require('./controllers/taxonomyController');
  router.get('/taxonomy/:id?',taxonomyController.getTaxonByTaxonomyId);
  router.get('/taxonomy/idlike/:id?',taxonomyController.getTaxonByIdLike);
  router.get('/taxonomy/namelike/:name?',taxonomyController.getTaxonByNameLike);
  router.get('/taxonomy/nameorid/:query?',taxonomyController.getTaxonByNameOrIdLike)
  router.get('/taxonomy/namelikeorid/:query?',taxonomyController.getTaxonByNameLikeOrId)
  
	// Protein domain Routes
  var proteinDomainController = require('./controllers/proteindomainController');
	router.get('/proteindomain/:acc?',proteinDomainController.getProteinDomainByAcc)
	router.get('/proteindomain/:acc?/distribution',proteinDomainController.getProteinDomainWithDistributionByAcc)
	router.get('/proteindomain/resource/:type?',proteinDomainController.getDataByResourceType)
	router.get('/proteindomain/distribution/resource/:type?',proteinDomainController.getDataWithDistributionByResourceType)

 // Assignment routes
	var assignmentController = require('./controllers/assignmentController');
  router.get('/assignment/:acc?',assignmentController.getAssignmentByAcc)
  router.get('/assignment/proteindomain/acc/resource/:type?/taxonomy/:id?',assignmentController.getAccByResourceTypeAndTaxonomyId)
  router.get('/assignment/proteindomain/distribution/resource/:type?/taxonomy/:id?',assignmentController.getDataWithDistributionByResourceTypeAndTaxonomyId)
  router.get('/assignment/proteindomain/resource/:type?/taxonomy/:id?',assignmentController.getDataByResourceTypeAndTaxonomyId)

  // Clan membership
  var clanController = require('./controllers/clanController');
  router.get('/clanmembership/:pfam?',clanController.getClanByPfamAcc)

};