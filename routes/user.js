const controller = require('../controllers/user');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	// Login
	router.get('/auth/google/redirect', controller.routeUserLoginGoogle);

};