const mongoose = require('mongoose');
const uuid = require('uuid/v4');

mongoose.model('SportsTeam', new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	calendarId: {
		type: Number,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	sport: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	level: {
		type: String,
		required: true
	}
}, {
	collection: 'sportsteams'
}));