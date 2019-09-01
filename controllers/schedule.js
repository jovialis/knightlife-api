const mongoose = require('mongoose');
const DetailedError = require('../util/detailedError');

const removeKey = require('key-del');

// Retrieve lunch for a day
module.exports.routeGetScheduleForDate = (req, res, next) => {
	const date = req.date;

	retrieveScheduleObjectForDate(date, true).then(schedule => {
		res.json(schedule);
	}).catch(next);
};

module.exports.getScheduleForDate = retrieveScheduleForDate;

function retrieveScheduleForDate(date) {
	return new Promise((resolve, reject) => {
		const Schedule = mongoose.model('Schedule');

		Schedule.findOne({
			date: date
		}).then(async schedule => {
			if (!schedule) {
				// Need to create a menu
				try {
					schedule = await createScheduleForDate(date);
				} catch (error) {
					reject(error);
					return;
				}
			}

			resolve(schedule);
		}).catch(error => {
			reject(error);
		});
	});
}

module.exports.getScheduleObjectForDate = retrieveScheduleObjectForDate;

function retrieveScheduleObjectForDate(date, sanitize) {
	return new Promise((resolve, reject) => {
		retrieveScheduleForDate(date).then(object => {
			// Populate block dates instead of having simple times
			object.timetables.forEach(t => {
				t.blocks.forEach(b => b.populateDates(object.date));
			});

			let scheduleObject = object.toObject();

			if (sanitize) {
				removeKey(scheduleObject, ['_id', '__t', '__v'], {copy: false});
			}

			resolve(scheduleObject);
		}).catch(error => {
			reject(error);
		});
	});
}

function createScheduleForDate(date) {
	return new Promise((resolve, reject) => {
		const Schedule = mongoose.model('Schedule');

		const daysOfWeek = [ 'mo', 'tu', 'we', 'th', 'fr', 'sa', 'su' ];

		const dayOfWeek = daysOfWeek[(date.getDay() - 1) % 7];

		const dayPreset = template.days[dayOfWeek];

		let timetables = [];
		if (dayPreset !== undefined) {
			const blockList = dayPreset.blocks;

			timetables.push({
				blocks: blockList
			});
		}

		Schedule.create({
			date: date,
			timetables: timetables
		}).then(resolve).catch(reject);
	});
}

module.exports.routeGetScheduleByBadge = (req, res, next) => {
	const badge = req.param('badge');

	getScheduleByBadge(badge).then(doc => {
		if (doc) {
			// Populate block dates instead of having simple times
			doc.timetables.forEach(t => {
				t.blocks.forEach(b => b.populateDates(doc.date));
			});

			let scheduleObject = doc.toObject();
			removeKey(scheduleObject, ['_id', '__t', '__v'], {copy: false});

			res.json({
				index: scheduleObject
			});
			return;
		}

		// Invalid badge
		next(new DetailedError(400, 'error_invalid_badge', 'Invalid badge provided.'));
	}).catch(next);
};

module.exports.getTimetableForGradeFromSchedule = getTimetableForGradeFromSchedule;
function getTimetableForGradeFromSchedule(schedule, grade) {
	// User has a grade
	if (grade != null) {
		// Search schedule for a grade-specific timetable
		for (const timetable of schedule.timetables) {
			// Ensure that it's a grade-specific timetable
			if (timetable.kind === 'GradeSpecificTimetable') {
				// Make sure the grade lines up
				if (timetable.grade === grade) {
					return timetable;
				}
			}
		}

		// No grade-specific timetables found.
	}

	// Return a non grade-specific timetable
	for (const timetable of schedule.timetables) {
		if (timetable.kind === 'Timetable') {
			return timetable;
		}
	}

	// No non grade specific timetable find. This should never happen.
	return null;
}

function getScheduleByBadge(badge) {
	return new Promise((resolve, reject) => {
		const Schedule = mongoose.model('Schedule');

		Schedule.findOne({
			badge: badge
		}).then(resolve).catch(reject);
	});
}

const template = require('../assets/schedule-template');
module.exports.template = template;
