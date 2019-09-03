const mongoose = require('mongoose');
const removeKey = require('key-del');
const DetailedError = require('../util/detailedError');

module.exports.routeGetSurvey = (req, res, next) => {
	const version = req.device.version;

	const Survey = mongoose.model('Survey');
	Survey.findOne({
		versions: {
			$in: version
		}
	}).then(doc => {
		if (!doc) {
			next(new DetailedError(404, 'error_not_found', 'Could not find a relevant survey.'));
			return;
		}

		let docObject = doc.toObject();
		removeKey(docObject, [ '__v', '_id' ], {copy: false});

		res.json(docObject);
	}).catch(next);
};