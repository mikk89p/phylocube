var routeCache = require('route-cache');


module.exports = function(router) {

  var cacheInSeconds = 7200 //2h
  // Resources
  var resourceController = require('./controllers/resourceController');
  router.get('/resource',resourceController.getResource);
	router.get('/resource/:type?/version/:version?',resourceController.getResource);

	//Taxonomy Routes
  var taxonomyController = require('./controllers/taxonomyController');
  router.get('/taxonomy/:id?',taxonomyController.getTaxonByTaxonomyId);
  router.get('/taxonomy/idlike/:id?',taxonomyController.getTaxonByIdLike);
  router.get('/taxonomy/namelike/:name?',taxonomyController.getTaxonByNameLike);
  router.get('/taxonomy/nameorid/:query?',taxonomyController.getTaxonByNameOrIdLike)
  router.get('/taxonomy/namelikeorid/:query?',taxonomyController.getTaxonByNameLikeOrId)
  
	// Protein domain Routes
  var proteinDomainController = require('./controllers/proteindomainController');
  router.get('/proteindomain',routeCache.cacheSeconds(cacheInSeconds),proteinDomainController.getProteinDomainByAcc)
	router.get('/proteindomain/:acc?/version/:version?',routeCache.cacheSeconds(cacheInSeconds),proteinDomainController.getProteinDomainByAcc)
	router.get('/proteindomain/:acc?/version/:version?/distribution',routeCache.cacheSeconds(cacheInSeconds),proteinDomainController.getProteinDomainWithDistributionByAcc)
	router.get('/proteindomain/resource/:type?/version/:version?',routeCache.cacheSeconds(cacheInSeconds),proteinDomainController.getDataByResourceType)
	router.get('/proteindomain/distribution/resource/:type?/version/:version?',routeCache.cacheSeconds(cacheInSeconds),proteinDomainController.getDataWithDistributionByResourceType)

 // Assignment routes
	var assignmentController = require('./controllers/assignmentController');
  router.get('/assignment/:acc?/resource/:type?/version/:version?',routeCache.cacheSeconds(cacheInSeconds),assignmentController.getAssignmentByAcc)
  router.get('/assignment/proteindomain/acc/resource/:type?/version/:version?/taxonomy/:id?',routeCache.cacheSeconds(cacheInSeconds),assignmentController.getAccByResourceTypeAndTaxonomyId)
  router.get('/assignment/proteindomain/distribution/resource/:type?/version/:version?/taxonomy/:id?',routeCache.cacheSeconds(cacheInSeconds),routeCache.cacheSeconds(cacheInSeconds), assignmentController.getDataWithDistributionByResourceTypeAndTaxonomyId)
  router.get('/assignment/proteindomain/resource/:type?/version/:version?/taxonomy/:id?',routeCache.cacheSeconds(cacheInSeconds),assignmentController.getDataByResourceTypeAndTaxonomyId)

  // Clan membership
  var clanController = require('./controllers/clanController');
  router.get('/clanmembership/:pfam?/version/:version?',clanController.getClanByPfamAcc)

};