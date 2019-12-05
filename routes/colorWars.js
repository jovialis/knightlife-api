const controller = require('../controllers/colorWars');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	// Mobile
	router.get('/m/colorwars/:team', controller.routeGetPointsByTeam);
	router.get('/m/colorwars/:badge', controller.routeGetTeamByBadge);

};