const controller = require('../controllers/lunchDashboard');
const parseDate = require('../middlewares/date').parseDate;
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	router.get('/d/lunch/menu/:year/:month/:day', [ auth.requirePermission('lunch'), parseDate ], controller.routeGetMenu);
	router.post('/d/lunch/menu/:year/:month/:day', [ auth.requirePermission('lunch'), parseDate ], controller.routePutMenu);

	router.get('/d/lunch/suggest', auth.requirePermission('lunch'), controller.routeGetSuggestion);
	router.post('/d/lunch/suggest/hide/:badge', auth.requirePermission('lunch'), controller.routeHideSuggestion);

};