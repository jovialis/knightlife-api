module.exports.path = "lunch";
module.exports.method = "get";

module.exports.called = function (req, res) {
	const date = Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(null);
		return
	}

	let dateString = require(`${__basedir}/utils/date-check`)(date);
	require(`${__basedir}/database/models/lunch`).findOne({
		date: dateString
	}, function (error, object) {
		if (error) {
			console.log(error);

			res.json(null);
			return;
		}

		let result = {
			"item": (object == null ? { "items": [] } : object)
		};

		res.json(result);
	})
};
