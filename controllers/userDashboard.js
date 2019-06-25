const userController = require('./user');
const removeKey = require('key-del');

class Module {
	constructor(id, name, permissions, icon) {
		this.id = id;
		this.name = name;
		this.permissions = permissions;
		this.icon = icon; // Feather icon name: https://feathericons.com
	}
}

// Define all available user modules.
const modules = [
	// Top-level modules
	new Module('schedule', 'Scheduling', [ 'schedule' ], 'clock'),
	new Module('messages', 'Push Messages', [ 'messaging' ], 'message-square'),
	new Module('lunch', 'Lunch Menus', [ 'lunch' ], 'coffee'),
	new Module('events', 'Events', [ 'event' ], 'calendar'),
	// new Module('news', 'News', [ 'news' ], 'globe'),
	new Module('users', 'Users', [ 'users' ], 'users'),

	// Secondary modules
	// new Module('colorwars', 'Color Wars', [ 'event.category.colorwars' ], 'zap'),
	// new Module('snowdays', 'Snow Days', [ 'news.add', 'schedule' ], 'cloud-snow')
];

module.exports.retrieveUserModules = retrieveUserModules;

function retrieveUserModules(user) {
	return new Promise(async (resolve, reject) => {
		let userModules = [];

		for (const module of modules) {
			try {
				if (await userController.userHasPermission(user, module.permissions)) {
					userModules.push(module);
				}
			} catch (err) {
				reject(err);
				return;
			}
		}

		resolve(userModules);
	});
}

module.exports.userHasModule = userHasModule;

function userHasModule(user, moduleName) {
	return new Promise(async (resolve, reject) => {
		for (const module of modules) {
			if (module.id === moduleName) {
				try {
					const valid = await userController.userHasPermission(user, module.permissions);
					resolve(valid);
					return;
				} catch (err) {
					reject(err);
					return;
				}
			}
		}
		resolve(false);
	});
}

module.exports.routeGetUserModules = (req, res) => {
	const user = req.user;

	retrieveUserModules(user).then(modules => {
		let moduleObjects = removeKey(modules, ['permissions'], {copy: true});

		res.json({
			modules: moduleObjects
		});
	}).catch(error => {
		res.status(500).send("An Internal Error Occurred");
		console.log(error);
	})
};