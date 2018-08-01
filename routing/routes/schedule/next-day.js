module.exports.path = "schedule/next";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let parsed = new Date(req.param("date"));
	if (!parsed) {
		console.log("Invalid date requested: " + req.param("data"));

		res.json(null);
		return;
	}

	const nextDay = Date(parsed + 1);
	if (!nextDay) {
		console.log("Could not find the next day for " + parsed + ".")
		res.json(null);
	}

	self.retrieveNextSchoolday(1, nextDay, function(schedule) {
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
				self.retrieveNextSchoolday(count + 1, Date(date + 1), callback); // If no result, then we try the
				// next day
			} else {
				callback(schedule);
			}
		}
	});
}