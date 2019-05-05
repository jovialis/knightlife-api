const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const removeKey = require('key-del');

const googleUtil = require('../util/google');

module.exports.getUserFromToken = getUserFromToken;

function getUserFromToken(token) {
	return new Promise((resolve, reject) => {
		const User = mongoose.model('User');
		User.findOne({
			tokens: {
				$in: [token]
			}
		}).then(doc => {
			resolve(doc);
		}).catch(err => {
			reject(err);
		});
	});
}

module.exports.routeValidateUserSession = async (req, res) => {
	let user;

	if (req.user) {
		user = req.user;
	} else {
		// Otherwise, we assume that an authentication token has been attached
		try {
			const token = req.query.token;
			user = await getUserFromToken(token);
		} catch (error) {
			console.log(error);
			res.status(500).send("An Internal Error Occurred");

			return;
		}
	}

	if (!user) {
		res.json({valid: false});
		return;
	}

	const userObject = user.toObject();
	removeKey(userObject, ['tokens', 'devices', '_id', '__v', '__t', 'badge'], {copy: false});

	res.json({
		valid: true,
		user: userObject
	});
};

module.exports.routeLogoutUser = (req, res) => {
	// Unset cookies
	res.cookies.set('Session', '', {
		domain: 'bbnknightlife.com',
		secure: true,
		signed: true,
		overwrite: true,
		maxAge: 0
	});

	res.redirect(process.env.LOGIN_FAILURE_REDIRECT);
};

module.exports.routeUserAbout = async (req, res) => {
	let user;

	// If user has been attached
	if (req.user) {
		user = req.user;
	} else {
		// Otherwise, we assume that an authentication token has been attached
		try {
			const token = req.query.token;
			user = await getUserFromToken(token);
		} catch (error) {
			console.log(error);
			res.status(500).send("An Internal Error Occurred");

			return;
		}
	}

	if (!user) {
		res.writeHead(401, {
			'WWW-Authentication': 'Basic'
		});
		res.end("Unauthorized access");
		return;
	}

	const userObject = user.toObject();
	removeKey(userObject, ['tokens', 'devices', '_id', '__v', '__t', 'badge'], {copy: false});

	res.json({
		user: userObject
	});
};

module.exports.routeValidateTokenPermission = (req, res) => {
	const token = req.body.token;
	const permission = req.body.permission;

	getUserFromToken(token).then(user => {
		if (!user) {
			res.json({valid: false});
			return;
		}

		const userObject = user.toObject();
		removeKey(userObject, ['tokens', 'devices', '_id', '__v', '__t', 'badge'], {copy: false});

		userHasPermission(user, permission).then(has => {
			if (has) {
				res.json({
					valid: true,
					user: userObject
				})
			} else {
				res.json({valid: false});
			}
		}).catch(error => {
			console.log(error);
			res.status(500).send("An Internal Error Occurred");
		});
	}).catch(error => {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	});
};

module.exports.routeUserOpenGoogleLogin = (req, res) => {
	res.redirect(googleUtil.urlGoogle());
};

module.exports.routeUserLoginGoogle = async (req, res) => {
	const code = req.query.code;
	if (!code) {
		res.redirect(`${process.env.LOGIN_FAILURE_REDIRECT}?error=${req.query.error}`);
		return;
	}

	googleUtil.getGoogleAccountFromCode(code).then(account => {
		const GoogleUser = mongoose.model('GoogleUser');

		GoogleUser.findOne({
			badge: account.badge
		}).then(async doc => {
			if (!doc) {
				doc = await GoogleUser.create({
					badge: account.badge,
					username: account.username
				});
			}

			// Username, Badge
			const token = uuid();

			// Add token
			doc.tokens.push(token);

			// Account settings
			doc.username = account.username;
			doc.name = account.name;
			doc.image = account.image;

			// Change image url size to 250px from 50px
			doc.image = doc.image.replace('/s50/', '/s250/');

			doc.save().then(() => {
				//COOKIE

				res.cookies.set('Session', token, {
					domain: 'bbnknightlife.com',
					secure: true,
					signed: true,
					overwrite: true
				});

				res.redirect(process.env.LOGIN_SUCCESS_REDIRECT);
			}).catch(error => {
				console.log(error);
				res.status(500).send("An Internal Error Occurred");
			})
		}).catch(error => {
			console.log(error);
			res.status(500).send("An Internal Error Occurred");
		});
	}).catch(error => {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	});
};

module.exports.userHasPermission = userHasPermission;

function userHasPermission(account, required) {
	return new Promise((resolve, reject) => {
		const Permission = mongoose.model('Permission');

		Permission.find({
			user: account._id
		}, (err, permissions) => {
			if (err) {
				reject(err);
				return;
			}

			let permissionsToCheck = required;

			// If user didn't provide a list of permissions we put that into a list.
			if (typeof required[Symbol.iterator] !== 'function') {
				permissionsToCheck = [required];
			}

			const now = new Date();
			for (const permissionToCheck of permissionsToCheck) {
				let valid = false;

				for (const userPermission of permissions) {
					// If the permission has an expiration date we ignore it
					if (userPermission.expiration !== undefined && userPermission.expiration !== null) {
						if (userPermission.expiration < now) {
							continue;
						}
					}

					if (permissionIsAdequate(userPermission.permission, permissionToCheck)) {
						valid = true;
						break;
					}
				}

				// If the user doesn't have a valid permission for this item we return.
				if (!valid) {
					resolve(false);
					return;
				}
			}

			resolve(true);
		});
	});
}

module.exports.userHasPermissionFromToken = userHasPermissionFromToken;

function userHasPermissionFromToken(token, permissions) {
	return new Promise((resolve, reject) => {
		getUserFromToken(token).then(account => {
			userHasPermission(account, permissions).then(has => {
				resolve(has);
			}).catch(reject);
		}).catch(reject);
	});
}

function permissionIsAdequate(userPermission, requiredPermission) {
	// We compare by getting each segment, separated by periods.
	const splitUserPermission = userPermission.split('.');
	const splitRequiredPermission = requiredPermission.split('.');

	// Go through indexes side by side.
	let i = 0;

	// Only go through until the end of the user, because if the user permission is shallower
	// than the required one, and they match up until the end, then the user is allowed to perform that action.
	while (i < splitUserPermission.length) {

		// If the user has a permission that's deeper than the one required, we know to return false.
		if (i >= splitRequiredPermission.length) {
			return false;
		}

		const curUserPermission = splitUserPermission[i];
		const curRequiredPermission = splitRequiredPermission[i];

		// If the user has a wildcard at this position, we know that they have permission.
		if (curUserPermission === '*') {
			return true;
		}

		// If the user's permission doesn't match, then they definitely don't have permission.
		if (curUserPermission.toUpperCase() !== curRequiredPermission.toUpperCase()) {
			return false;
		}

		i++;
	}

	return true;
}