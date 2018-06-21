'use strict';
module.exports = function(app) {
  var resource = require('../controllers/resourceController');

	// Routes
  app.route('/resources')
    .get(resource.list_all_resources)
};