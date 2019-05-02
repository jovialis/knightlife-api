const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const userSchema = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	username: {
		type: String,
		required: true
	},
	name: String,
	image: String,
	tokens: [{
		type: String,
		default: []
	}],
	devices: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Device',
		default: []
	}]
}, {
	collection: "accounts"
});

const User = mongoose.model("User", userSchema);

User.discriminator('FormUser', new mongoose.Schema({
	passhash: String
}));

User.discriminator('GoogleUser', new mongoose.Schema({}));