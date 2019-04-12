const mongoose = require('mongoose');

module.exports.routeRegisterDeviceId = (req, res) => {
	const token = req.get('Device');

	registerDeviceId(token).then(doc => {
		res.json({
			success: true
		});
	}).catch(error => {
		console.log(error);
		res.status(500).send('An Internal Error Occurred');
	});
};

function registerDeviceId(token) {
	return new Promise((resolve, reject) => {
		const Device = mongoose.model('Device');

		Device.find({
			token: token
		}).then(doc => {
			if (doc) {
				resolve(doc);
				return;
			}

			// Needs to be created
			Device.create({
				token: token
			}).then(doc => {
				resolve(doc);
			}).catch(reject);
		}).catch(reject);
	});
}