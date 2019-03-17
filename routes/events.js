const controller = require('../controllers/events');
const parseDate = require('../middlewares/date').parseDate;
const query = require('../middlewares/queries');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	// Mobile
	router.get('/m/events', [ query.parseCategories, query.parseFilters ], controller.routeGetEvents);
	router.get('/m/events/:year/:month/:day', [ parseDate, query.parseCategories, query.parseFilters ], controller.routeGetEventsForDate);
	router.get('/m/events/:badge', controller.routeGetEventByBadge);

};