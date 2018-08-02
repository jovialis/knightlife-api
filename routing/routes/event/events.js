module.exports.path = "events";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	let date = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(formatter.error("Invalid date requested"));
		return
	}

	let dateString = require(`${__basedir}/utils/date-formatter`)(date);
	const cursorData = require(`${__basedir}/database/models/event`).find({
		date: dateString
	}).toArray();

	const result = cursorData ? cursorData : [];
	res.json(formatter.success(result, "events", dateString));
};
