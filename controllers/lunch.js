const mongoose = require('mongoose');
const Lunch = mongoose.model('Lunch');

const removeKey = require('key-del');

// Retrieve lunch for a day
module.exports.routeGetLunchForDate = (req, res) => {
	const date = req.date;

	retrieveLunchObjectForDate(date, true).then(menu => {
		removeKey(menu.items, [ 'badge', 'suggest', 'nameLower', 'allergyLower' ], { copy: false });

		res.json(menu);
	}).catch(error => {
		res.status(500).send("An Internal Error Occurred");
		console.log(error);
	});
};

module.exports.getLunchForDate = retrieveLunchMenuForDay;

function retrieveLunchMenuForDay(date) {
	return new Promise((resolve, reject) => {
		Lunch.findOne({
			date: date
		}).populate('items').exec().then(async menu => {
			if (!menu) {
				// Need to create a menu
				try {
					menu = await Lunch.create({
						date: date
					});
				} catch (error) {
					reject(error);
					return;
				}
			}

			resolve(menu);
		}).catch(error => {
			reject(error);
		});
	});
}

module.exports.getLunchObjectForDate = retrieveLunchObjectForDate;

function retrieveLunchObjectForDate(date, sanitize) {
	return new Promise((resolve, reject) => {
		retrieveLunchMenuForDay(date).then(object => {
			let menuObject = object.toObject();

			if (sanitize) {
				removeKey(menuObject, ['_id', '__t', '__v'], {copy: false});
			}

			resolve(menuObject);
		}).catch(error => {
			reject(error);
		});
	});
}

module.exports.routeGetLunchByBadge = (req, res) => {
	const badge = req.param('badge');

	getLunchByBadge(badge).then(doc => {
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

function getLunchByBadge(badge) {
	return new Promise((resolve, reject) => {
		Lunch.findOne({
			badge: badge
		}).then(resolve).catch(reject);
	});
}

module.exports.hideSuggestion = hideSuggestion;
function hideSuggestion(badge) {
	return new Promise(async (resolve, reject) => {
		const Food = mongoose.model('Food');

		try {
			await Food.findOneAndUpdate({
				badge: badge
			}, {
				suggest: false
			});

			resolve(true);
		} catch (err) {
			reject(err);
		}
	});
}

module.exports.doUpdate = doUpdate;
function doUpdate(lunch, props) {
	const title = props.title;
	const items = props.items;

	return new Promise(async (resolve, reject) => {
		try {
			let idList = [];

			const Food = mongoose.model('Food');

			for (const item of items) {
				// Require item name for processing
				if (!item.name) {
					continue;
				}

				// Blank string allergies get turned to null
				if (item.allergy && item.allergy.trim().length === 0) {
					item.allergy = null;
				}

				const indexingName = item.name.trim().toLowerCase();
				const indexingAllergy = item.allergy ? (item.allergy.trim().toLowerCase()) : null;

				const alreadyExisting = await Food.findOne({
					nameLower: indexingName,
					allergyLower: indexingAllergy
				});

				if (alreadyExisting) {
					// If we're adding it as a menu option, we're going to reset the suggest flag.
					if (!alreadyExisting.suggest) {
						alreadyExisting.suggest = true;
						await alreadyExisting.save();
					}

					idList.push(alreadyExisting._id);
					continue;
				}

				const name = item.name.trim();
				const allergy = item.allergy ? (item.allergy.trim()) : null;

				const newFood = await Food.create({
					name: name,
					allergy: allergy
				});

				idList.push(newFood._id);
			}

			lunch.title = title;
			lunch.items = idList;

			resolve(await lunch.save());
		} catch (err) {
			reject(err);
		}
	});
}