module.exports.path = "events";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	let date = Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(formatter.error("Invalid date requested"));
		return
	}

	let dateString = require(`${__basedir}/utils/date-formatter`)(date);

	let result = [];
	res.json(formatter.success(result, "events", dateString));
};
