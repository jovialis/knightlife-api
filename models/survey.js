const mongoose = require('mongoose');

const Survey = new mongoose.Schema({
	versions: [{
		type: String,
		required: true
	}],
	url: {
		type: String,
		required: true
	}
}, {
	collection: 'surveys'
});

mongoose.model('Survey', Survey);