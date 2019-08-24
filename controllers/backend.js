const mongoose = require('mongoose');
const DetailedError = require('../util/detailedError');

module.exports.routeRegisterDeviceId = (req, res, next) => {
	const token = req.get('Device');
	const version = req.get('Version');

	if (!token || !version) {
		next(new DetailedError(401, 'error_incomplete_request', 'Device ID or software version not provided.'));
		return;
	}

	registerDeviceId(token, version).then(doc => {
		res.json({
			success: true
		});
	}).catch(next);
};

function registerDeviceId(token, version) {
	return new Promise((resolve, reject) => {
		const Device = mongoose.model('Device');

		Device.findOne({
			token: token
		}).then(doc => {
			if (doc) {
				doc.version = version;

				doc.save().then(doc => {
					resolve(doc);
				}).catch(reject);
				return;
			}

			// Needs to be created
			Device.create({
				token: token,
				version: version
			}).then(doc => {
				resolve(doc);
			}).catch(reject);
		}).catch(reject);
	});
}