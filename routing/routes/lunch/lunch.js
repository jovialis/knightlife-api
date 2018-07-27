module.exports.path = "lunch";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let date = require(`${__basedir}/utils/date-check`)(req.param("date"));

	if (!date) { // No date supplied
		res.json(null);
		console.log("Invalid date supplied!");
		return;
	}

	require(`${__basedir}/database/models/lunch`).findOne({
		date: date
	}, function (error, object) {
		if (error) {
			console.log(error);
			res.json(null);
			return;
		}

		let result = {
			"menu": (object == null ? { "items": [] } : object)
		};

		res.json(result);
	})
};
