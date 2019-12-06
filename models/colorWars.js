const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const ColorWars = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	team: {	type: Array, default: []},
	bigcall: {
		type: String,
		default: null
	}
}, {
	collection: 'surveys'
});

mongoose.model('ColorWars', ColorWars);