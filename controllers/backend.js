const mongoose = require('mongoose');

module.exports.routeRegisterDeviceId = (req, res) => {
	const token = req.get('Device');
	const version = req.get('Version');

	if (!token || !version) {
		res.status(401);
		res.json({
			success: false,
			error: "Incomplete information provided"
		});
		return;
	}

	registerDeviceId(token, version).then(doc => {
		res.json({
			success: true
		});
	}).catch(error => {
		console.log(error);
		res.status(500).send('An Internal Error Occurred');
	});
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