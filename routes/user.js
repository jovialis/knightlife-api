const controller = require('../controllers/user');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	// Login
	router.get('/auth/google', controller.routeUserOpenGoogleLogin);
	router.get('/auth/google/redirect', controller.routeUserLoginGoogle);

	router.get('/auth/logout', controller.routeLogoutUser);

	// Website validation
	router.get('/auth/validate', auth.fetchUser, controller.routeValidateUserSession);
	router.get('/auth/validate/permission', auth.fetchUser, controller.routeValidateUserSessionPermission);


};