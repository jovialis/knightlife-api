module.exports.path = "events";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	let rawDate = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(formatter.error("Invalid date requested"));
		return
	}

	let date = Date(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate());
	let dateString = require(`${__basedir}/utils/date-formatter`)(date);

	require(`${__basedir}/database/models/event`).find({
		date: date
	}, function (error, events) {
		if (error) {
			console.log(error);

			res.json(formatter.error(error));
			return;
		}

		let resultList = [];
		events.forEach(function (event) {
			resultList.push(event);
		});

		res.json(formatter.success(resultList, "events", dateString));
		return;
	});
};
