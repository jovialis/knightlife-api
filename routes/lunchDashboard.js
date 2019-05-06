const controller = require('../controllers/lunchDashboard');
const cors = require('../util/corsOrigins');
const parseDate = require('../middlewares/date').parseDate;
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	router.get('/d/lunch/menu/:year/:month/:day', [ /*cors.wwwKL,*/ /*auth.requirePermission('lunch'),*/ parseDate ],
	 controller.routeGetMenu);
	router.post('/d/lunch/menu/:year/:month/:day', [ /*cors.wwwKL,*/ auth.requirePermission('lunch'), parseDate ],
	 controller.routePutMenu);

	router.get('/d/lunch/suggest', [/*cors.wwwKL,*/ auth.requirePermission('lunch')], controller.routeGetSuggestion);
	router.post('/d/lunch/suggest/hide/:badge', [/*cors.wwwKL,*/ auth.requirePermission('lunch')], controller.routeHideSuggestion);

};