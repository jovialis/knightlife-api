const mongoose = require('mongoose');
const ColorWars = mongoose.model('ColorWars');
// const WarColor = mongoose.model('WarColor');

const removeKey = require('key-del');


module.exports.routeGetPointsByTeam = (req, res) => {
	const team = req.param('team');

	getPointsByTeam(team).then(doc => {
		if (doc) {
			let menuObject = doc.toObject();
			removeKey(menuObject, ['_id', '__t', '__v'], {copy: false});

			res.json(menuObject);
			return;
		}

		// Invalid badge
		res.status(400).send('Invalid Badge Provided');
	}).catch(error => {
		console.log(error);
		res.status(500).send('An Internal Error Occurred');
	});
};

function getPointsByTeam(team) {
	return new Promise((resolve, reject) => {
		ColorWars.findOne({
			bigcall: team
		}).then(resolve).catch(reject);
	});
}

// Retrieve lunch for a day
// module.exports.routeGetPointsForTeam = (req, res, next) => {
// 	const team = req.param('team');

// 	retrievePointObjectForTeam(team, true).then(points => {
// 		removeKey(points.items, [ 'badge', 'team' ], { copy: false });
// 		// ^ Not sure if I need these in but I'm not going to mess with removing them yet
// 		res.json(points);
// 	}).catch(next);
// };

// module.exports.getPointsForTeam = retrievePointsForTeam;

// function retrievePointsForTeam(team) {
// 	return new Promise((resolve, reject) => {
// 		ColorWars.findOne({
// 			team: team
// 		}).populate('points').exec().then(async menu => {
// 			if (!menu) {
// 				// Used by lower function, for creating team object to clear
// 				try {
// 					menu = await ColorWars.create({
// 						team: team
// 					});
// 				} catch (error) {
// 					reject(error);
// 					return;
// 				}
// 			}

// 			resolve(menu);
// 		}).catch(reject);
// 	});
// }

// module.exports.getLunchObjectForDate = retrievePointObjectForTeam;

// function retrievePointObjectForTeam(team, sanitize) {
// 	return new Promise((resolve, reject) => {
// 		retrievePointsForTeam(team).then(object => {
// 			let PointObject = object.toObject();

// 			if (sanitize) {
// 				removeKey(PointObject, ['_id', '__t', '__v', 'suggest', 'allergyLower', 'nameLower'], {copy: false});
// 				// ^ Not sure if I need these in but I'm not going to mess with removing them yet
// 			} // Returns name and allergy of food doc

// 			resolve(PointObject);
// 		}).catch(reject);
// 	});
// }

module.exports.routeGetTeamByBadge = (req, res) => {
	const badge = req.param('badge');
	console.log(badge);
	getTeamByBadge(badge).then(doc => {
		if (doc) {
			let teamObject = doc.toObject();
			removeKey(teamObject, ['_id', '__t', '__v'], {copy: false});

			res.json(teamObject);
			return;
		}

		// Invalid badge
		res.status(400).send('Invalid Badge Provided');
		// res.status(400).send(badge)
	}).catch(error => {
		console.log(error);
		res.status(500).send('An Internal Error Occurred');
	});
};

function getTeamByBadge(badge) {
	return new Promise((resolve, reject) => {
		ColorWars.findOne({
			badge: badge
		}).then(resolve).catch(reject);
	});
}

// module.exports.hideSuggestion = hideSuggestion;
// function hideSuggestion(badge) {
// 	return new Promise(async (resolve, reject) => {
// 		const Food = mongoose.model('Food');

// 		try {
// 			await Food.findOneAndUpdate({
// 				badge: badge
// 			}, {
// 				suggest: false
// 			});

// 			resolve(true);
// 		} catch (err) {
// 			reject(err);
// 		}
// 	});
// }

// module.exports.doUpdate = doUpdate;
// function doUpdate(lunch, props) {
// 	const title = props.title;
// 	const items = props.items;

// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			let idList = [];

// 			const Food = mongoose.model('Food');

// 			for (const item of items) {
// 				// Require item name for processing
// 				if (!item.name) {
// 					continue;
// 				}

// 				// Blank string allergies get turned to null
// 				if (item.allergy && item.allergy.trim().length === 0) {
// 					item.allergy = null;
// 				}

// 				const indexingName = item.name.trim().toLowerCase();
// 				const indexingAllergy = item.allergy ? (item.allergy.trim().toLowerCase()) : null;

// 				const alreadyExisting = await Food.findOne({
// 					nameLower: indexingName,
// 					allergyLower: indexingAllergy
// 				});

// 				if (alreadyExisting) {
// 					// If we're adding it as a menu option, we're going to reset the suggest flag.
// 					if (!alreadyExisting.suggest) {
// 						alreadyExisting.suggest = true;
// 						await alreadyExisting.save();
// 					}

// 					idList.push(alreadyExisting._id);
// 					continue;
// 				}

// 				const name = item.name.trim();
// 				const allergy = item.allergy ? (item.allergy.trim()) : null;

// 				const newFood = await Food.create({
// 					name: name,
// 					allergy: allergy
// 				});

// 				idList.push(newFood._id);
// 			}

// 			lunch.title = title;
// 			lunch.items = idList;

// 			resolve(await lunch.save());
// 		} catch (err) {
// 			reject(err);
// 		}
// 	});
// }