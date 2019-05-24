const mongoose = require('mongoose');
const removeKey = require('key-del');

module.exports.routeGetSurvey = (req, res) => {
	const version = req.get('Version');

	const Survey = mongoose.model('Survey');
	Survey.findOne({
		version: version
	}).then(doc => {
		if (!doc) {
			res.status(404).send('Could not find a relevant survey.');
			return;
		}

		let docObject = doc.toObject();
		removeKey(docObject, [ '__v', '_id' ], {copy: false});

		res.json(docObject);
	}).catch(error => {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	});
};