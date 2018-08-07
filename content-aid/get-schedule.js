// Date is the date, callback is a function with one parameter, for the schedule object
module.exports = function(date, callback) {
	let dateString = require(`${__basedir}/utils/date-formatter`)(date);

	console.log("Fetching schedule for date: " + dateString);

	require(`${__basedir}/database/models/schedule`).findOne({
		date: date
	}, function (error, object) {
		if (object) {
			console.log("Found schedule patch for date: " + dateString);

			callback(null, object);
		} else { // Gotta take the schedule from the template
			console.log("Couldn't find schedule patch for date: " + dateString + ". Reading from schedule template.");

			let dayOfWeek = date.getDay();
			if (dayOfWeek === 0) { dayOfWeek = 7 } // If it's sunday, move it to end of week.
			dayOfWeek--; // 0 = Monday, 6 = Sunday

			let dayKey = ["m", "t", "w", "th", "f", "sa", "su"][dayOfWeek];

			require(`${__basedir}/database/models/template`).findOne({}, function (error, object) {
				if (error) {
					console.log("An error occurred: " + error);

					callback(error, null);
					return
				}

				for (dayIndex in object["days"]) {
					let dayData = object["days"][dayIndex];

					console.log(dayData["id"]);

					if (dayData["id"] === dayKey) {
                        delete dayData.id;
						console.log("Retrieved schedule for " + dateString + " from schedule template.");

						callback(null, dayData);
						return;
					}
				}

				console.log("Uh oh! We shouldn't be here.");
				callback(null, null);
			})
		}
	})
};