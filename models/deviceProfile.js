const mongoose = require('mongoose');

const DeviceProfile = new mongoose.Schema({
	// Store the associated grade with the device. Null for unset
	grade: {
		type: Number,
		default: null
	}
}, {
	collection: 'deviceProfiles'
});

mongoose.model('DeviceProfile', DeviceProfile);

