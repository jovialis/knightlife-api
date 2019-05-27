const controller = require('../controllers/scheduleDashboard');
const cors = require('cors');
const parseDate = require('../middlewares/date').parseDate;
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	const corsOptions = {
		origin: true,
		credentials: true,
		optionsSuccessStatus: 200
	};

	router.get('/d/schedule/:year/:month/:day', [ cors(corsOptions), /*auth.requirePermission('lunch'),*/ parseDate ], controller.routeGetSchedule);

	router.post('/d/schedule/:year/:month/:day/submit', [ cors(corsOptions), auth.requirePermission('schedule'), parseDate ], controller.routePutSchedule);
	router.options('/d/schedule/:year/:month/:day/submit', cors(corsOptions));

};