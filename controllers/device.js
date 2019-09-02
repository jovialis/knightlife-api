const mongoose = require('mongoose');
const DetailedError = require('../util/detailedError');
const pusher = require('./push');

// Fetch the device associated with this token. If it doesn't exist, create it and validate with apple servers that the token is valid.
module.exports.retrieveDeviceFromToken = (token, version) => {
	return new Promise((resolve, reject) => {
		const Device = mongoose.model('Device');
		Device.findOne({
			token: token
		}).populate('profile').exec().then(async doc => {
			// No document found
			if (!doc) {
				// Validate token with Apple's push servers.
				pusher.sendDummyData(token).then(success => {
					// Get a list of failed tokens
					const failed = success.failed;

					// Check if the list isn't empty. This means that the token failed to push.
					if (failed.length > 0) {
						reject(new DetailedError(400, 'err_invalid_token', 'Request does not contain a valid Device token.'));
						return;
					}

					// If we got to this point, the token is valid and we can insert it into the database.
					// Create Device document
					Device.create({
						token: token,
						version: version,
						profile: mongoose.Types.ObjectId()
					}).then(doc => {
						// Create Device profile document
						const DeviceProfile = mongoose.model('DeviceProfile');
						DeviceProfile.create({
							_id: doc.profile
						}).then(profileDoc => {
							// Prefill the Device document with the Profile so we don't need to populate later
							doc.profile = profileDoc;

							// Return the doc we just created. All done!
							resolve(doc);
						}).catch(reject);
					}).catch(reject);
				}).catch(reject);
				return;
			}

			// If no profile, we create a profile object for the Device.
			if (!doc.profile) {
				// Create profile document
				const DeviceProfile = mongoose.model('DeviceProfile');
				const profile = await DeviceProfile.create({});

				// Set the profile ObjectId
				doc.profile = profile._id;

				try {
					await doc.save();
				} catch (err) {
					reject(err);
					return;
				}

				// Set the profile object so it'll be populated when we return the doc
				doc.profile = profile;
			}

			try {
				// Update and save doc with latest version information. This also ensures that the device profile will be automatically generated and saved if it isn't already present.
				doc.version = version;
				await doc.save();
			} catch (err) {
				reject(err);
				return;
			}

			// Resolve with doc
			resolve(doc);
		}).catch(reject);
	});
};

module.exports.routeUpdateDeviceProfile = (req, res, next) => {
	// Should have been populated in middleware
	const device = req.device;

	let profileContent = {
		...req.body
	};

	// Ensure grade validity
	if (profileContent.grade) {
		// Invalid grade value means defaults to null
		if (profileContent.grade < 0 || profileContent.grade > 3) {
			profileContent.grade = null;
		}
	}

	// Update profile with settings
	device.profile.update(profileContent).then(() => {
		res.json({
			success: true
		});
	}).catch(next);
};