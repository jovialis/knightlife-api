const controller = require('../controllers/bundle');
const parseDate = require('../middlewares/date').parseDate;

module.exports.registerRoutes = (router) => {

	// Mobile
	router.get('/m/bundle/:year/:month/:day', [ parseDate ], controller.routeGetBundleForDate);
	router.get('/m/bundle/week', controller.routeGetWeekBundles);

};