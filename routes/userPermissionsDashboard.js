const controller = require('../controllers/userPermissionsDashboard');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	router.get('/d/users/search', /*auth.requirePermission('users.overview'),*/ controller.routeGetSearchedUser);
	router.get('/d/users/overview/:badge', /*auth.requirePermission('users.overview'),*/ controller.routeGetUserOverview)

};