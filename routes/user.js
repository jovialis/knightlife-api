const controller = require('../controllers/user');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	// Login
	router.get('/auth/google', controller.routeUserOpenGoogleLogin);
	router.get('/auth/google/redirect', controller.routeUserLoginGoogle);

	// Website validation
	router.post('/auth/validate', controller.routeValidateToken);
	router.post('/auth/validate/permission', controller.routeValidateTokenPermission);

};