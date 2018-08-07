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

	const endDate = Date(date.getTime()).setDate(date.getDate() + 14);

	const sample = {
		'content': [
			{
				'date': '2018-8-5',
				'mode': [0, 2] // 0 = patch, 1 = events
			},
			{
				'date': '2018-8-6',
				'mode': [1]
			}
		]
	};

	fetchSchedule(date, endDate, function(error, result) {
		if (error) {
			console.log(error);

			res.json(formatter.error(error));
			return;
		}

		let objectList = result;

		fetchEvents(date, endDate, function(error, result) {
			if (error) {
				console.log(error);

				res.json(formatter.error(error));
				return;
			}

			objectList.push(result);

			const normalizedList = normalizeList(objectList);
			res.json(formatter.success(normalizedList, "notification stack", date));
		});
	});
};

// then: (error, objects)
function fetchSchedule(date, endDate, then) {
	require(`${__basedir}/database/models/schedule`).findOne({
		date: { $gte: date, $lte: endDate }
	}, function (error, object) {
		then(error, object)
	});
}

function fetchEvents(date, endDate, then) {
	require(`${__basedir}/database/models/event`).find({
		date: { $gte: date, $lte: endDate }
	}, function (error, events) {
		then(error, events)
	});
}

function normalizeList(objects) {
	
}