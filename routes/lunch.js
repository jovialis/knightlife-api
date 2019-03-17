const controller = require('../controllers/lunch');
const parseDate = require('../middlewares/date').parseDate;
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	// Mobile
	router.get('/m/lunch/:year/:month/:day', [ parseDate ], controller.routeGetLunchForDate);
	router.get('/m/lunch/:badge', controller.routeGetLunchByBadge);

	// Dashboard
	// router.get('/d/pages/dashboard/lunch/:year/:month/:day', [ auth.requirePermission('lunch'), parseDate ], controller.routeGetData);
	// router.put('/d/pages/dashboard/lunch/:year/:month/:day', [ auth.requirePermission('lunch'), parseDate ], controller.routePutData);
	//
	// router.get('/d/pages/dashboard/lunch/suggest', auth.requirePermission('lunch'), controller.routeSuggestFood);
	// router.put('/d/pages/dashboard/lunch/suggest/hide/:id', auth.requirePermission('lunch'), controller.routeHideSuggestedFood);

};