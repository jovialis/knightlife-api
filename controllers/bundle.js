const scheduleController = require('./schedule');
const lunchController = require('./lunch');
const eventController = require('./events');

module.exports.routeGetBundleForDate = async (req, res) => {
	const date = req.date;

	try {
		const schedule = await scheduleController.getScheduleObjectForDate(date, true);
		const lunch = await lunchController.getLunchObjectForDate(date, true);
		const events = await eventController.fetchEventsObjectForDay(date, {}, true);

		res.json({
			index: {
				schedule: schedule,
				lunch: lunch,
				events: events
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	}
};