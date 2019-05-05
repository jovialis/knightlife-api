const controller = require('../controllers/user');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	// Login
	router.get('/auth/google', controller.routeUserOpenGoogleLogin);
	router.get('/auth/google/redirect', controller.routeUserLoginGoogle);

	// Website validation
	router.get('/auth/validate', auth.fetchUser, controller.routeValidateUserSession);
	router.get('/auth/validate/permission', auth.fetchUser, controller.routeValidateTokenPermission);

	router.get('/auth/logout', controller.routeLogoutUser);

	// Token must be passed as a query key
	router.get('/user/about', auth.fetchUser, controller.routeUserAbout);
};