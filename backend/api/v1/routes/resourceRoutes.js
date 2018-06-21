module.exports = function(app) {
  var resourceController = require('../controllers/resourceController');

	// Routes
  app.route('/resources/:id?').get(resourceController.get)
};