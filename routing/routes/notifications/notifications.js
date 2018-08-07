module.exports.path = "notify";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	const date = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(require(formatter.error("Invalid date requested")));
		return
	}

	const sample = {
		'content': [
			{
				'date': '2018-8-5',
				'mode': [0, 2] // 0 = template, 1 = patch, 2 = events
			},
			{
				'date': '2018-8-6',
				'mode': [1]
			}
		]
	};

	let dateString = require(`${__basedir}/utils/date-formatter`)(date);
	require(`${__basedir}/database/models/event`).find({
		date: dateString
	}, function (error, object) {
		if (error) {
			console.log(error);

			res.json(formatter.error(error));
			return;
		}

		const result = object ? object : {'items': []};
		res.json(formatter.success(result, "lunch", dateString));
	});
};

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