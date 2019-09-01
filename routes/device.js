const controller = require('../controllers/device');
const deviceMiddleware = require('../middlewares/devices');

module.exports.registerRoutes = (router) => {

	// Update device profile
	router.post('/m/device/profile', [ deviceMiddleware.requireDevice ], controller.routeUpdateDeviceProfile);



};