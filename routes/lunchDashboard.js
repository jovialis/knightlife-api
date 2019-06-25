const controller = require('../controllers/lunchDashboard');
const cors = require('cors');
const parseDate = require('../middlewares/date').parseDate;
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	const corsOptions = {
		origin: true,
		credentials: true,
		optionsSuccessStatus: 200
	};

	router.get('/d/lunch/menu/:year/:month/:day', [ cors(corsOptions), /*auth.requirePermission('lunch'),*/ parseDate ], controller.routeGetMenu);

	router.post('/d/lunch/menu/:year/:month/:day/submit', [ cors(corsOptions), auth.requirePermission('lunch'), parseDate ], controller.routePutMenu);
	router.options('/d/lunch/menu/:year/:month/:day/submit', cors(corsOptions));

	router.get('/d/lunch/suggest', [cors(corsOptions), auth.requirePermission('lunch')], controller.routeGetSuggestion);
	router.post('/d/lunch/suggest/hide/:badge', [cors(corsOptions), auth.requirePermission('lunch')], controller.routeHideSuggestion);

};