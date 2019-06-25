const controller = require('../controllers/survey');

module.exports.registerRoutes = (router) => {

	// Mobile
	router.get('/m/survey', controller.routeGetSurvey);

};