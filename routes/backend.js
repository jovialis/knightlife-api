const controller = require('../controllers/backend');

module.exports.registerRoutes = (router) => {

	// Mobile
	router.post('/m/device/register', controller.routeRegisterDeviceId);

};