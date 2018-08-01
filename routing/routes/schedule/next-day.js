module.exports.path = "schedule/next";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let parsed = new Date(req.param("date"));
	if (!parsed) {
		console.log("Invalid date requested: " + req.param("data"));

		res.json(null);
		return;
	}

	parsed.setDate(parsed.getDate() + 1);
	if (!parsed) {
		console.log("Could not find the next day for " + parsed + ".");

		res.json(null);
		return
	}

	retrieveNextSchoolday(1, parsed, function(schedule) {
		if (schedule) {
			res.json({
				"item": schedule
			});
		} else {
			res.json(null);
		}
	});
};

// RECURSION :O
function retrieveNextSchoolday(count, date, callback) {
	if (count > 7) { // Only check next 7 days
		callback(null);
		return;
	}

	require(`${__basedir}/content-aid/get-schedule`)(date, function(error, schedule) {
		if (schedule) {
			if (!schedule['blocks'] || schedule['blocks'].length < 1) {
				date.setDate(date.getDate() + 1); // Move date foreward one day
				retrieveNextSchoolday(count + 1, date, callback); // If no result, then
				// we try the
				// next day
			} else {
				callback(schedule);
			}
		}
	});
}