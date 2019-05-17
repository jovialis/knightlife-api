const scheduleController = require('./schedule');
const lunchController = require('./lunch');
const eventController = require('./events');

module.exports.routeGetBundleForDate = (req, res) => {
	getBundleForDate(req.date).then(bundle => {
		res.json(bundle);
	}).catch(error => {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	});
};

module.exports.routeGetWeekBundles = (req, res) => {
	const date = new Date();
	date.setUTCHours(0,0,0,0);

	getWeekBundle(date, 7).then(bundle => {
		res.json(bundle);
	}).catch(error => {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	});
};


function getBundleForDate(date) {
	return new Promise(async (resolve, reject) => {
		try {
			const schedule = await scheduleController.getScheduleObjectForDate(date, true);
			const lunch = await lunchController.getLunchObjectForDate(date, true);
			const events = await eventController.fetchEventsObjectForDay(date, {}, true);

			resolve({
				date: date,
				schedule: schedule,
				lunch: lunch,
				events: events
			});
		} catch (error) {
			reject(error);
		}
	});
}

function getWeekBundle(date, days) {
	return new Promise(async (resolve, reject) => {
		let packaged = {};

		for (let i = 0; i < days; i++) {
			const newDate = new Date(+date);
			newDate.setUTCDate(newDate.getUTCDate() + i);

			try {
				packaged[newDate.toISOString()] = await getBundleForDate(newDate);
			} catch (error) {
				reject(error);
				return;
			}
		}

		resolve(packaged);
	});
}