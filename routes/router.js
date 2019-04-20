const express = require('express');

const cors = require('cors');
const expressSsl = require('express-sslify');

const bodyParser = require('body-parser');

// Instantiation
module.exports.init = () => {
	const router = express();

	// POST middleware
	router.use(bodyParser.urlencoded({ extended: true }));
	router.use(bodyParser.json());

	// CORS support
	router.use(cors());

	// Redirect to HTTPS when allowed
	if (process.env.ENFORCE_HTTPS) {
		router.use(expressSsl.HTTPS({ trustProtoHeader: true }));
	}

	registerRoutes(router);

	router.get('*', (req, res) => { res.status(404).send("Not Found") });
	router.post('*', (req, res) => { res.status(404).send("Not Found") });
	router.put('*', (req, res) => { res.status(404).send("Not Found") });
	router.delete('*', (req, res) => { res.status(404).send("Not Found") });

	// Grab port and start listening
	const port = process.env.PORT || 5000;
	router.listen(port, () => {
		console.log("Express is now listening on port: " + port);
	});
};

function registerRoutes(router) {

	require('./backend').registerRoutes(router);
	require('./bundle').registerRoutes(router);
	require('./events').registerRoutes(router);

	require('./lunch').registerRoutes(router);
	require('./lunchDashboard').registerRoutes(router);

	// require('./push').registerRoutes(router);
	require('./schedule').registerRoutes(router);
	require('./user').registerRoutes(router);

}

// function register(app) {
//
// 	/*********************************************
// 	 PORTAL
// 	 **********************************************/
//
// 	// Auth
// 	require('./routes/portal/auth/post-submit-login').register(app);
// 	require('./routes/portal/auth/post-retrieve-session-validation').register(app);
//
// 	require('./routes/portal/auth/google/post-retrieve-google-redirect').register(app);
// 	require('./routes/portal/auth/google/post-submit-google-login').register(app);
//
// 	// Dashboard
// 	require('./routes/portal/dashboard/post-retrieve-page-home').register(app);
//
// 	// Lunch
// 	require('./routes/portal/dashboard/lunch/post-retrieve-page-lunch').register(app);
// 	require('./routes/portal/dashboard/lunch/post-retrieve-food-suggestions').register(app);
// 	require('./routes/portal/dashboard/lunch/post-submit-data-lunch').register(app);
// 	require('./routes/portal/dashboard/lunch/post-submit-hide-suggestion').register(app);
//
//
// 	/*********************************************
// 	 APP
// 	 **********************************************/
//
// 	require('./routes/mobile/day/post-retrieve-day').register(app);
//
// 	require('./routes/mobile/events/post-retrieve-events').register(app);
// 	require('./routes/mobile/events/post-retrieve-day-events').register(app);
// }