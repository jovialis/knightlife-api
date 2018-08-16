module.exports = function (req, res) {
	const formatter = require(`${__basedir}/utils/response-formatter`);

	let date = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("data"));

		res.json(formatter.error("Invalid date requested"));
		return;
	}

	//Fetch date
	require(`${__basedir}/content-aid/get-schedule`)(date, function(error, schedule) {
		if (!schedule) {
			console.log("Failed to get schedule: " + error);

			res.json(formatter.error("Could not get schedule."));
			return;
		}

		const dateString = require(`${__basedir}/utils/date-formatter`)(date);
		res.json(formatter.success(schedule, "schedule", dateString));
	});
};
