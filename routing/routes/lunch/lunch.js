module.exports.path = "lunch";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	const date = Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(require(formatter.error("Invalid date requested"));
		return
	}

	let dateString = require(`${__basedir}/utils/date-check`)(date);
	require(`${__basedir}/database/models/lunch`).findOne({
		date: dateString
	}, function (error, object) {
		if (error) {
			console.log(error);

			res.json(formatter.error(error));
			return;
		}

		res.json(formatter.success(object, "lunch", dateString));
	})
};
