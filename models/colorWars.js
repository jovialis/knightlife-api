const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const cwPoints = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	team: {
		type: String,
		default: null
	},
	points: {
        type: Int32Array,
        default: 0
    }
}, {
	collection: 'surveys'
});

mongoose.model('ColorWars', ColorWars);