const controller = require('../controllers/survey');
const deviceMiddleware = require('../middlewares/devices');

module.exports.registerRoutes = (router) => {

	// Mobile
	router.get('/m/survey', [deviceMiddleware.requireDevice], controller.routeGetSurvey);

};