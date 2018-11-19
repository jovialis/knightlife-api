module.exports = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	let parsed = new Date(req.param("date"));
	if (!parsed) {
		console.log("Invalid date requested: " + req.param("data"));

		res.json(formatter.error("Invalid date requested"));
		return;
	}

	parsed.setDate(parsed.getDate() + 1);
	if (!parsed) {
		console.log("Could not find the next day for " + parsed + ".");

		res.json(formatter.error("Could not complete request"));
		return
	}

	retrieveNextSchoolday(1, parsed, function(schedule, date) {
		if (schedule) {
			const dateString = require(`${__basedir}/utils/date-formatter`)(date);
			res.json(formatter.success(schedule, "schedule", dateString));
		} else {
			res.json(formatter.error("Could not complete request"));
		}
	});
};

// RECURSION :O
function retrieveNextSchoolday(count, date, callback) {
	if (count > 7) { // Only check next 7 days
		callback(null, null);
		return;
	}

	require(`${__basedir}/content-aid/get-schedule`)(date, function(error, schedule) {
		if (schedule) {
			if (!schedule['blocks'] || schedule['blocks'].length < 1) {
				date.setDate(date.getDate() + 1); // Move date foreward one day
				retrieveNextSchoolday(count + 1, date, callback); // If no result, then we try the next day
			} else {
				callback(schedule, date);
			}
		}
	});
}