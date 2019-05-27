const mongoose = require('mongoose');
const removeKey = require('key-del');
const allPermissions = require('../assets/possiblePermissions');
const users = require('./user');

module.exports.routeGetSearchedUser = (req, res) => {
	const name = req.query.term;

	const User = mongoose.model('User');
	User.find({
		$or: [
			{
				nameLower: {
					'$regex': name.toLowerCase()
				}
			},
			{
				usernameLower: {
					'$regex': name.toLowerCase()
				}
			}
		]
	}).then(docs => {
		let docsList = docs.map(d => d.toObject());
		removeKey(docsList, [ '_id', '__v', '__t', 'usernameLower', 'nameLower', 'tokens', 'devices' ], {copy: false});

		res.json(docsList);
	}).catch(err => {
		console.log(err);
		res.status(500).send('An internal error occurred.');
	});
};

module.exports.routeGetUserOverview = (req, res) => {
	const badge = req.params.badge;

	const User = mongoose.model('User');
	User.findOne({
		badge: badge
	}).then(doc => {
		if (!doc) {
			res.status(404).send('Invalid badge');
			return;
		}

		// Find out which permissions the user has, which are inherited, which aren't available
		users.getUserPermissionsMap(doc).then(permissions => {
			res.json(permissions);
		});
	}).catch(err => {
		console.log(err);
		res.status(500).send('An internal error occurred.');
	});
};