const controller = require('../controllers/lunch');
const parseDate = require('../middlewares/date').parseDate;
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	// Mobile
	router.get('/m/lunch/:year/:month/:day', [ parseDate ], controller.routeGetLunchForDate);
	router.get('/m/lunch/:badge', controller.routeGetLunchByBadge);

};