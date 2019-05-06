const mongoose = require('mongoose');
const Food = mongoose.model('Food');
const lunchController = require('./lunch');
const removeKey = require('key-del');

module.exports.routeGetMenu = (req, res) => {
	const date = req.date;

	lunchController.getLunchObjectForDate(date, false).then(menu => {
		removeKey(menu, ['_id', '__t', 'suggest', 'allergyLower', 'nameLower', '__v'], {copy: false});
		// removeKey(menu.items, ['__v'], {copy: false});

		res.json({
			menu: menu
		})
	}).catch(error => {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	});
};

module.exports.routePutMenu = (req, res) => {
	const date = req.date;

	// const version = req.body.__v;
	const title = req.body.title;
	const foodItems = req.body.items;

	lunchController.getLunchForDate(date).then(async document => {
		// if (document.__v !== version) {
		// 	res.json({
		// 		success: false,
		// 		error: "Inconsistent version"
		// 	});
		// 	return;
		// }

		let foodIdList = [];

		try {
			for (const item of foodItems) {
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

					foodIdList.push(alreadyExisting._id);
					continue;
				}

				const name = item.name.trim();
				const allergy = item.allergy ? (item.allergy.trim()) : null;

				const newFood = await Food.create({
					name: name,
					allergy: allergy
				});

				foodIdList.push(newFood._id);
			}
		} catch (err) {
			console.log(err);
			res.status(500).send("An Internal Error Occurred");

			return;
		}

		let newTitle = title.trim();
		newTitle = newTitle.length === 0 ? null : newTitle;

		document.title = newTitle;
		document.items = foodIdList;

		document.save().then(async () => {
			try {
				const result = await require('./push').sendTargetedRefresh(document.date, "lunch");
				console.log("Successfully updated lunch menu, pushed refresh to " + result.sent.length + " devices and failed to send to " + result.failed.length + " devices.");

				console.log(result.failed);

				res.json({
					success: true
				});
			} catch (error) {
				console.log(error);
				res.json({
					success: false
				});
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

module.exports.routeGetSuggestion = (req, res) => {
	const name = req.query.term;

	Food.find({
		suggest: true,
		nameLower: {
			'$regex': name.toLowerCase()
		}
	}).then(docs => {
		let foods = docs.map(i => i.toObject());
		removeKey(foods, ['_id', '__v', 'nameLower', 'allergyLower'], { copy: false });

		res.json({
			items: foods
		});
	}).catch(err => {
		console.log(err);
		res.status(500).send("An Internal Error Occurred");
	});
};

module.exports.routeHideSuggestion = (req, res) => {
	const badge = req.params.badge;

	Food.findOneAndUpdate({
		badge: badge
	}, {
		suggest: false
	}).then(doc => {
		if (!doc) {
			res.json({
				success: false,
				error: "Invalid badge provided"
			});
			return;
		}

		res.json({
			success: true
		});
	}).catch(err => {
		console.log(err);
		res.status(500).send("An Internal Error Occurred");
	})
};