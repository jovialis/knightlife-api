const controller = require('../controllers/upcoming');
const deviceMiddleware = require('../middlewares/devices');

module.exports.registerRoutes = (router) => {

	// Upcoming items route
	router.get('/m/upcoming', [deviceMiddleware.requireDevice], (req, res, next) => {
		const profile = req.device.profile;
		let grade = profile.grade;

		controller.getUpcoming(grade).then(items => {
			res.json({
				upcoming: items
			});
		}).catch(next);
	});

};