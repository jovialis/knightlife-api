const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const ColorWars = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	team: {
		type: String,
		default: null
	},
	points: {
        type: Number,
        default: 0
    }
}, {
	collection: 'surveys'
});

const WarColor = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	points: [{
		type: TeamPoints
	}]
}, {
	collection: 'surveys'
});

const TeamPoints = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	gold: {
		type: Int32Array,
		default: -1
	},
	black: {
		type: Int32Array,
		default: -1
	},
	white: {
		type: Int32Array,
		default: -1
	},
	blue: {
		type: Int32Array,
		default: -1
	}

}, {
	_id: false
});

mongoose.model('WarColor', WarColor);
mongoose.model('ColorWars', ColorWars);