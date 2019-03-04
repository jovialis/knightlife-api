const controller = require('../controllers/user');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	// Login
	router.post('/auth/google/login', controller.routeUserLoginGoogle);

	// Dashboard page
	// router.get('/d/pages/dashboard/home', auth.requireUser, require('../pages/dashboard-home').routeGetData);

};