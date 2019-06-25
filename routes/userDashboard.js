const controller = require('../controllers/userDashboard');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	router.get('/d/modules', auth.requireUser, controller.routeGetUserModules);

};