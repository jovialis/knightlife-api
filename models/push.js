const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const PushSchema = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	target: {
		type: String,
		required: true
	},
	anonymous: {
		type: Boolean,
		default: false
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	results: {
		received: {
			type: [ String ],
			required: true
		},
		rejected: {
			type: [ String ],
			required: true
		}
	}
}, {
	collection: 'pushes',
	discriminatorKey: 'kind'
});

const Push = mongoose.model('Push', PushSchema);

const MessagePushSchema = new mongoose.Schema({
	title: {
		type: String,
		default: null
	},
	alert: {
		type: String,
		required: true
	},
	sound: {
		type: String,
		default: null
	}
});

Push.discriminator('MessagePush', MessagePushSchema);