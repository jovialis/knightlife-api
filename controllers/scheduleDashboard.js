const schedules = require('./schedule');
const removeKey = require('key-del');
const DetailedError = require('../util/detailedError');

module.exports.routeGetSchedule = (req, res, next) => {
	const date = req.date;

	schedules.getScheduleForDate(date).then(schedule => {
		let scheduleObject = schedule.toObject();
		removeKey(scheduleObject, [ '_id', '__v', '__t' ], {copy: false});

		res.json({
			schedule: scheduleObject
		});
	}).catch(next);
};

module.exports.routePutSchedule = (req, res, next) => {
	const date = req.date;
	const timetables = req.body.timetables;

	schedules.getScheduleForDate(date).then(schedule => {
		// TODO: Preserve Block badges across saves

		schedule.timetables = timetables;

		// Manually validate
		schedule.validate(error => {
			if (error) {
				next(new DetailedError(403, 'error_validation', 'Submitted data failed validation.'));
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
					next(error);
				}
			}).catch(next);
		});
	}).catch(next);
};