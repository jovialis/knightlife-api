const controller = require('../controllers/user');
const Keygrip = require('keygrip');

function retrieveTokenFromRequest(req) {
	let userToken;

	// If there are authentication headers provided
	if (req.get('Session') && req.get('Session.sig')) {
		const token = req.get('Session');
		const tokenSig = req.get('Session.sig');

		const grip = Keygrip([ process.env.COOKIE_SECRET ]);
		if (grip.verify(`Session=${token}`, tokenSig)) {
			userToken = token;
		}
	}

	// If no userToken has been set yet, we attempt to load a Session by cookies
	if (!userToken) {
		userToken = req.cookies.get('Session', { signed: true });
	}

	return userToken;
}

module.exports.fetchUser = (req, res, next) => {
	const token = retrieveTokenFromRequest(req);

	if (!token) {
		next();
		return;
	}

	controller.getUserFromToken(token).then(user => {
		// Set user variable
		req.user = user;
		next();
	}).catch(error => {
		next(error);
	});
};

module.exports.requireUser = (req, res, next) => {
	const token = retrieveTokenFromRequest(req);

	if (!token) {
		res.writeHead(401, {
			'WWW-Authentication': 'Basic'
		});
		res.end("Unauthorized access");
		return;
	}

	controller.getUserFromToken(token).then(user => {
		if (!user) {
			// No user = unauthorized
			res.writeHead(401, {
				'WWW-Authentication': 'Basic'
			});
			res.end("Unauthorized access");
			return;
		}

		// Set user variable
		req.user = user;
		next();
	}).catch(error => {
		next(error);
	});
};

module.exports.requirePermission = (permission) => {
	return (req, res, next) => {
		// TODO: Transfer variables from request to permission

		const token = retrieveTokenFromRequest(req);

		if (!token) {
			res.writeHead(401, {
				'WWW-Authentication': 'Basic'
			});
			res.end("No User Supplied");
			return;
		}

		controller.getUserFromToken(token).then(user => {
			if (!user) {
				res.writeHead(401, {
					'WWW-Authentication': 'Basic'
				});
				res.end("No User Supplied");
				return;
			}

			controller.userHasPermission(user, permission).then(valid => {
				if (!valid) {
					// Unauthorized
					res.writeHead(401, {
						'WWW-Authentication': 'Basic'
					});
					res.end("Invalid permissions");
					return;
				}

				req.user = user;
				next();
			}).catch(next);
		}).catch(error => {
			next(error);
		});
	};
};