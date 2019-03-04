const mongoose = require('mongoose');

module.exports.init = () => {
	// Start DB connection
	mongoose.connect(process.env.MONGODB_URI);

	registerModels();
};

function registerModels() {

	require('./device');
	require('./event');
	require('./food');
	require('./lunch');
	require('./news');
	require('./permission');
	require('./push');
	require('./schedule');
	require('./sportsteam');
	require('./user');

}