const mongoose = require('mongoose');

const removeKey = require('key-del');

// Retrieve lunch for a day
module.exports.routeGetScheduleForDate = (req, res) => {
	const date = req.date;

	retrieveScheduleObjectForDate(date, true).then(schedule => {
		res.json({
			index: schedule
		});
	}).catch(error => {
		res.status(500).send("An Internal Error Occurred");
		console.log(error);
	});
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

		const dayOfWeek = daysOfWeek[date.getDay()];

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

const template = require('../assets/schedule-template');
module.exports.template = template;
