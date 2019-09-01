const mongoose = require('mongoose');
const bundleController = require('./bundle');
const scheduleController = require('./schedule');

// How many days in the future to look for upcoming events
const UPCOMING_PROJECTION = 14;

module.exports.getUpcoming = (grade) => {
	// Retrieve upcoming for the next few days
	return new Promise(async (resolve, reject) => {
		// Sentinal date
		const date = new Date();
		date.setHours(0, 0, 0, 0);

		let bundles;

		try {
			// Obtain bundles for the next PROJECTION days
			bundles = await bundleController.getWeekBundle(date, UPCOMING_PROJECTION);
		} catch (err) {
			reject(err);
			return;
		}

		let upcomingDays = {};

		// Filter through days
		for (let bundleKey in bundles) {
			if (!bundles.hasOwnProperty(bundleKey)) {
				continue;
			}

			const bundle = bundles[bundleKey];

			let dayUpcomingItems = [];

			// UPCOMING ITEMS FOR SCHEDULE

			let schedule = bundle.schedule;

			// Obtain user's timetable to see if it is marked as a special schedule
			let userTimetable = scheduleController.getTimetableForGradeFromSchedule(schedule, grade);

			if (userTimetable && userTimetable.special === true) {
				// Append this as an upcoming item of the special-schedule type
				dayUpcomingItems.push({
					type: 'special-schedule',
					details: {
						badge: schedule.badge
					}
				});
			}

			// UPCOMING ITEMS FOR EVENTS

			let events = bundle.events;

			for (const event of events) {
				let additionalDetails = {};

				// If there are specific audiences specified, we check to ensure that the user's grade settings permit viewing this event
				if (event.audience && event.audience.length > 0) {
					let userIncluded = false;

					// Check if the user's grade is included in the audience
					for (const audience of event.audience) {
						if (audience.grade === grade) {
							userIncluded = true;

							// Include mandatory settings from the audience
							additionalDetails = {
								mandatory: audience.mandatory
							};

							// Break from audience search
							break;
						}
					}

					// User should NOT see this event so we continue to the next
					if (!userIncluded) {
						continue;
					}
				}

				// Push event to upcoming items
				dayUpcomingItems.push({
					type: 'event',
					details: {
						badge: event.badge,
						kind: event.kind,
						categories: event.categories,
						schedule: event.schedule,
						title: event.title,
						description: event.description,
						location: event.location,
						...additionalDetails
					}
				});
			}

			// Push the day's upcoming items to the master list if there were upcoming items
			if (dayUpcomingItems.length > 0) {
				upcomingDays[bundleKey] = dayUpcomingItems;
			}
		}

		resolve(upcomingDays);
	});
};