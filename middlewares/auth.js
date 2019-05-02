const controller = require('../controllers/user');

module.exports.fetchUser = (req, res, next) => {
	const token = req.cookies.get('Session', { signed: true });

	if (!token) {
		res.writeHead(401, {
			'WWW-Authentication': 'Basic'
		});
		res.end("Unauthorized access");
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
	const token = req.cookies.get('Session', { signed: true });

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

		const token = req.cookies.get('Session', { signed: true });

		if (!token) {
			res.writeHead(401, {
				'WWW-Authentication': 'Basic'
			});
			res.end("Unauthorized access");
			return;
		}

		controller.userHasPermissionFromToken(token, permission).then((user, valid) => {
			if (!valid) {
				// Unauthorized
				res.writeHead(401, {
					'WWW-Authentication': 'Basic'
				});
				res.end("Unauthorized access");
				return;
			}

			req.user = user;
			next();
		}).catch(error => {
			next(error);
		});
	};
};