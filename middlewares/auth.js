const controller = require('../controllers/user');

module.exports.fetchUser = (req, res, next) => {
	const token = req.get('User');
	controller.getUserFromToken(token).then(user => {
		// Set user variable
		req.user = user;
		next();
	}).catch(error => {
		next(error);
	});
};

module.exports.requireUser = (req, res, next) => {
	const token = req.get('User');
	controller.getUserFromToken(token).then(user => {
		if (!user) {
			// No user = unauthorized
			res.writeHead(401, {
				'WWW-Authentication': 'Basic'
			});
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

		const token = req.get('User');
		controller.userHasPermissionFromToken(token, permission).then((user, valid) => {
			if (!valid) {
				// Unauthorized
				res.writeHead(401, {
					'WWW-Authentication': 'Basic'
				});
				return;
			}

			req.user = user;
			next();
		}).catch(error => {
			next(error);
		});
	};
};