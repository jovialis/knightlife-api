const express = require('express');
const bodyParser = require('body-parser');
const expressSsl = require('express-sslify');
const Cookies = require('cookies');

// Instantiation
module.exports.init = () => {
	const router = express();

	// POST middleware
	router.use(bodyParser.urlencoded({extended: true}));
	router.use(bodyParser.json());

	// Instantiate cookies object in request
	router.use(Cookies.express([ process.env.COOKIE_SECRET ]));

	if (process.env.NODE_ENV === 'production') {
		// Redirect to HTTPS in production
		router.use(expressSsl.HTTPS({trustProtoHeader: true}));

		// Trust Proxy in production
		router.enable('trust proxy');
	}

	registerRoutes(router);

	router.all('*', (req, res) => {
		res.status(404).send("Not Found")
	});

	// Grab port and start listening
	const port = process.env.PORT || 5000;
	router.listen(port, () => {
		console.log("Express is now listening on port: " + port);
	});
};

function registerRoutes(router) {

	require('./backend').registerRoutes(router);
	require('./survey').registerRoutes(router);

	require('./bundle').registerRoutes(router);
	require('./events').registerRoutes(router);

	require('./lunch').registerRoutes(router);
	require('./lunchDashboard').registerRoutes(router);

	// require('./push').registerRoutes(router);
	require('./schedule').registerRoutes(router);

	require('./user').registerRoutes(router);
	require('./userDashboard').registerRoutes(router);

}