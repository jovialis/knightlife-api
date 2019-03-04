const controller = require('../controllers/schedule');
const parseDate = require('../middlewares/date').parseDate;
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	// Mobile
	router.get('/m/lunch/:year/:month/:day', [ parseDate ], controller.routeGetScheduleForDate);

	// Dashboard
	// router.get('/d/pages/dashboard/lunch/:year/:month/:day', [ auth.requirePermission('lunch'), parseDate ], controller.routeGetData);
	// router.put('/d/pages/dashboard/lunch/:year/:month/:day', [ auth.requirePermission('lunch'), parseDate ], controller.routePutData);
	//
	// router.get('/d/pages/dashboard/lunch/suggest', auth.requirePermission('lunch'), controller.routeSuggestFood);
	// router.get('/d/pages/dashboard/lunch/suggest/hide/:id', auth.requirePermission('lunch'), controller.routeHideSuggestedFood);

};