const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Food = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	name: {
		type: String,
		required: true
	},
	allergy: {
		type: String,
		default: null
	},
	suggest: {
		type: Boolean,
		default: true
	},
	nameLower: String,
	allergyLower: {
		type: String,
		default: null
	}
}, {
	collection: 'foods'
});

// Lowercase name for indexing in suggestions
Food.pre('save', function (next) {
	this.nameLower = this.name.toLowerCase();

	if (this.allergy) {
		this.allergyLower = this.allergy.toLowerCase();
	} else {
		this.allergyLower = null;
	}

	next();
});

mongoose.model('Food', Food);
