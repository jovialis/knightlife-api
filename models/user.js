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
	usernameLower: String,
	name: String,
	nameLower: String,
	image: String,
	tokens: {
		type: [String],
		default: []
	},
	devices: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Device',
		default: []
	}
}, {
	collection: "users"
});

// Lowercase name/userrname for indexing in suggestions
userSchema.pre('save', function (next) {
	this.usernameLower = this.username.toLowerCase();

	if (this.name) {
		this.nameLower = this.name.toLowerCase();
	} else {
		this.nameLower = null;
	}

	next();
});

const User = mongoose.model("User", userSchema);

User.discriminator('FormUser', new mongoose.Schema({
	passhash: String
}));

User.discriminator('GoogleUser', new mongoose.Schema({}));