const schedules = require('./schedule');
const removeKey = require('key-del');

module.exports.routeGetSchedule = (req, res) => {
	const date = req.date;

	schedules.getScheduleForDate(date).then(schedule => {
		let scheduleObject = schedule.toObject();
		removeKey(scheduleObject, [ '_id', '__v', '__t' ], {copy: false});

		res.json({
			schedule: scheduleObject
		});
	}).catch(error => {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	});
};

module.exports.routePutSchedule = (req, res) => {
	const date = req.date;
	const timetables = req.body.timetables;

	schedules.getScheduleForDate(date).then(schedule => {
		// TODO: Preserve Block badges across saves

		schedule.timetables = timetables;

		// Manually validate
		schedule.validate(error => {
			if (error) {
				res.status(403).send(error);
				return;
			}

			schedule.save().then(async document => {
				try {
					const result = await require('./push').sendTargetedRefresh(document.date, "schedule");
					console.log("Successfully updated schedule, pushed refresh to " + result.sent.length + " devices and failed to send to " + result.failed.length + " devices.");

					res.json({
						success: true
					});
				} catch (error) {
					console.log(error);
					res.json({
						success: false
					});
				}
			}).catch(err => {
				console.log(err);
				res.status(500).send("An Internal Error Occurred");
			})
		});

	}).catch(err => {
		console.log(err);
		res.status(500).send("An Internal Error Occurred");
	})
};