const mongoose = require('mongoose');

const Survey = new mongoose.Schema({
	version: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	}
}, {
	collection: 'surveys'
});

mongoose.model('Survey', Survey);