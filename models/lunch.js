const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Lunch = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	date: {
		type: Date,
		required: true,
		unique: true
	},
	title: {
		type: String,
		default: null
	},
	items: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Food',
		default: []
	}]
}, {
	collection: 'lunches'
});

Lunch.pre('save', function (next) {
	// Increment version ID
	this.increment();
	next();
});

mongoose.model('Lunch', Lunch);