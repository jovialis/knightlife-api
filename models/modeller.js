const mongoose = require('mongoose');

const options = {
	useNewUrlParser: true,
	reconnectInterval: 500,
	reconnectTries: 30
};

const connectWithRetry = () => {
	console.log('MongoDB connection with retry')
	mongoose.connect(process.env.MONGODB_URI, options).then(() => {
		console.log('MongoDB is connected')
	}).catch(err => {
		console.log('MongoDB connection unsuccessful, retry (' + err + ')')
		setTimeout(connectWithRetry, 5000)
	})
};

module.exports.init = () => {
	//Start DB connection
	connectWithRetry();
	registerModels();
};

function registerModels() {

	require('./device');
	require('./deviceProfile');
	require('./event');
	require('./food');
	require('./lunch');
	require('./news');
	require('./permission');
	require('./push');
	require('./schedule');
	require('./sportsteam');
	require('./colorWars');
	require('./user');
	require('./survey');

}