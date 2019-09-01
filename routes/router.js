const DetailedError = require("../util/detailedError");

const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const expressSsl = require('express-sslify');
const Cookies = require('cookies');
const fs = require('fs');

// Instantiation
module.exports.init = () => {
	// The application object.
	const router = express();

	// POST middleware
	router.use(bodyParser.urlencoded({extended: true}));
	router.use(bodyParser.json());

	// Instantiate cookies object in request
	router.use(Cookies.express([ process.env.COOKIE_SECRET ]));
	router.use(expressSsl.HTTPS({trustProtoHeader: true}));
	registerRoutes(router);

	// Handle errors with express
	router.use((err, req, res, next) => {
		console.log(err);

		// If detailed error available
		if (err instanceof DetailedError) {
			// Send JSON response
			res.status(err.errorCode).send({
				error: err.errorId,
				errorMessage: err.errorMessage
			});
		} else {
			res.status(500).send({
				error: 'err_server',
				errorMessage: 'An internal error occurred. Please contact an administrator.'
			});
		}
	});

	// Handle errors with express
	router.use((err, req, res, next) => {
		console.log(err);

		// If detailed error available
		if (err instanceof DetailedError) {
			// Send JSON response
			res.status(err.errorCode).send({
				error: err.errorId,
				errorMessage: err.errorMessage
			});
		} else {
			res.status(500).send({
				error: 'err_server',
				errorMessage: 'An internal error occurred. Please contact an administrator.'
			});
		}
	});

	router.all('*', (req, res) => {
		res.status(404).send("Not Found")
	});

	const port = process.env.PORT || 5000;

	// NODE_ENV is set in the docker-compose.yml
	if (process.env.NODE_ENV === 'development') {
		// For these certificates to be trusted, rootCA.cer must be installed
		// on the simulator. See docker/genca/Dockerfile.
		https.createServer({
			key:  fs.readFileSync('/home/node/localhost.key'),
			cert: fs.readFileSync('/home/node/localhost.cer')
		}, router).listen(port, () => {
			console.log("Express is now listening on port: " + port);
		});
	}
	else {
		router.enable('trust proxy');
		router.listen(port, () => {
			console.log("Express is now listening on port: " + port);
		});
	}
};

function registerRoutes(router) {

	require('./device').registerRoutes(router);
	require('./survey').registerRoutes(router);

	require('./bundle').registerRoutes(router);
	require('./events').registerRoutes(router);

	require('./lunch').registerRoutes(router);
	require('./lunchDashboard').registerRoutes(router);

	// require('./push').registerRoutes(router);
	require('./schedule').registerRoutes(router);
	require('./scheduleDashboard').registerRoutes(router);

	require('./upcoming').registerRoutes(router);

	require('./user').registerRoutes(router);
	require('./userDashboard').registerRoutes(router);
	require('./userPermissionsDashboard').registerRoutes(router);

}
