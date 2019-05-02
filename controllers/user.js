const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Cookies = require('cookies');

const googleUtil = require('../util/google');

module.exports.getUserFromToken = getUserFromToken;

async function getUserFromToken(token) {
	return new Promise((resolve, reject) => {
		const User = mongoose.model('User');
		User.findOne({
			tokens: {
				$in: token
			}
		}).then(doc => {
			resolve(doc);
		}).catch(err => {
			reject(err);
		});
	});
}

module.exports.routeUserOpenGoogleLogin = (req, res) => {
	res.redirect(googleUtil.urlGoogle());
};

module.exports.routeUserLoginGoogle = async (req, res) => {
	const code = req.query.code;
	if (!code) {
		res.redirect(`${process.env.LOGIN_SUCCESS_REDIRECT}?error=${req.query.error}`);
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
			account: account._id
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