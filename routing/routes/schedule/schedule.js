module.exports.path = "schedule";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let date = require(`${__basedir}/utils/date-check`)(req.param("date"))

	if (!date) { // No date supplied
		res.json(null)
		console.log("No date supplied!")
		return
	}

	require(`${__basedir}/database/models/schedule`).findOne(
		{date: date},
		function (error, object) {
			if (object) {
				console.log(object)

				res.json(object)
			} else { // Gotta take the schedule from the template
				console.log("Fetching schedule from template.");

				let dayOfWeek = new Date(req.param("date")).getDay()
				if (dayOfWeek === 0) { // If it's sunday, move it to end of week.
					dayOfWeek = 7
				}
				dayOfWeek--; // 0 = Monday, 6 = Sunday

				let key = ["M", "T", "W", "Th", "F", "Sa", "Su"][dayOfWeek];

				require(`${__basedir}/database/models/template`).findOne(
					{},
					function (error, object) {
						if (error) {
							res.json(null)
							throw error;
						}

						for (day in object["days"]) {
							if (object["days"][day]["id"] === key) {
								delete object["days"][day]["id"]
								res.json(object["days"][day])
								return;
							}
						}

						res.json(null);
					}
				)
			}
		}
	)
}
