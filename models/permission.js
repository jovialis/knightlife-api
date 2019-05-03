const mongoose = require('mongoose');

// Permissions
const Permission = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	giver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	timestamp: {
		type: Date,
		default: Date.now
	},
	expiration: {
		type: Date,
		default: null
	},
	permission: {
		type: String,
		required: true
	}
}, {
	collection: 'permissions'
});

mongoose.model('Permission', Permission);