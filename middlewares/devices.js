const controller = require('../controllers/device');
const DetailedError = require('../util/detailedError');

module.exports.captureDevice = (req, res, next) => {
	// Capture Device header
	const deviceToken = req.get('Device');
	const deviceVersion = req.get('Version');

	if (!deviceToken || !deviceVersion) {
		next(new DetailedError(401, 'error_incomplete_request', 'Device ID or software version not provided.'));
		return;
	}

	controller.retrieveDeviceFromToken(deviceToken, deviceVersion).then(device => {
		// Successfully found device
		req.device = device;ß
	}).catch(err => {
		console.log(`Attempted to discover Device. Encountered an error: ${ err }`);
		req.device = null;
	}).finally(() => {
		next();
	});
};

module.exports.requireDevice = (req, res, next) => {
	// Capture Device header
	const deviceToken = req.get('Device');
	const deviceVersion = req.get('Version');

	if (!deviceToken || !deviceVersion) {
		next(new DetailedError(401, 'error_incomplete_request', 'Device ID or software version not provided.'));
		return;
	}

	// Pass error to Express, preventing further execution of path.
	controller.retrieveDeviceFromToken(deviceToken, deviceVersion).then(device => {
		// Successfully found device
		req.device = device;
		next();
	}).catch(next);
};