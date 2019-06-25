const mongoose = require('mongoose');
const Event = mongoose.model('Event');

const removeKey = require('key-del');

// Retrieve all future events
module.exports.routeGetEvents = (req, res) => {
	const date = new Date();
	date.setUTCHours(0, 0, 0, 0);

	const filters = req.filters;
	const categories = req.categories;

	// Build query
	let query = {
		date: {
			$gte: date
		},
		hidden: false,
		...filters
	};

	// Add categories if there are any provided
	if (categories !== undefined && categories !== null && categories.length > 0) {
		query.categories = {
			$in: categories
		}
	}

	fetchEventsObject(query, true).then(events => {
		res.json(events);
	}).catch(error => {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	});
};

// Retrieve events for a day
module.exports.routeGetEventsForDate = (req, res) => {
	const date = req.date;
	const filters = req.filters;
	const categories = req.categories;

	let query = {
		hidden: false,
		...filters
	};

	if (categories !== undefined && categories !== null && categories.length > 0) {
		query.categories = {
			$in: categories
		}
	}

	fetchEventsObjectForDay(date, query, true).then(events => {
		res.json({
			date: date.toISOString(),
			events: events
		});
	}).catch(error => {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	});
};

module.exports.fetchEventsFromQuery = fetchEventsFromQuery;
function fetchEventsFromQuery(query) {
	return new Promise((resolve, reject) => {
		Event.find(query).sort({'schedule.start': 1, 'date': 1}).exec().then(resolve).catch(error => {
			reject(error);
		});
	});
}

module.exports.fetchEventsForDay = fetchEventsForDay;
function fetchEventsForDay(date, query) {
	return new Promise((resolve, reject) => {
		fetchEventsFromQuery({
			date: date,
			...query
		}).then(resolve).catch(reject);
	});
}

module.exports.fetchEventsObjectForDay = fetchEventsObjectForDay;
function fetchEventsObjectForDay(date, query, sanitize) {
	return new Promise((resolve, reject) => {
		fetchEventsForDay(date, query).then(objects => {
			let eventsObject = objects.map(i => i.toObject());

			if (sanitize) {
				removeKey(eventsObject, ['__v', '_id', 'calendarRaw', '__t', 'teamId', 'hidden'], { copy: false });
			}

			resolve(eventsObject);
		}).catch(reject)
	});
}

module.exports.fetchEventsObject = fetchEventsObject;
function fetchEventsObject(query, sanitize) {
	return new Promise((resolve, reject) => {
		fetchEventsFromQuery(query).then(objects => {
			let eventsObject = objects.map(i => i.toObject());

			if (sanitize) {
				removeKey(eventsObject, ['__v', '_id', 'calendarRaw', '__t', 'teamId', 'hidden'], { copy: false });
			}

			resolve(eventsObject);
		}).catch(reject)
	});
}

module.exports.routeGetEventByBadge = (req, res) => {
	const badge = req.param('badge');

	getEventByBadge(badge).then(doc => {
		if (doc) {
			let eventsObject = doc.toObject();
			removeKey(eventsObject, ['__v', '_id', 'calendarRaw', '__t', 'teamId', 'hidden'], { copy: false });

			res.json(eventsObject);
			return;
		}

		// Invalid badge
		res.status(400).send('Invalid Badge Provided');
	}).catch(error => {
		console.log(error);
		res.status(500).send('An Internal Error Occurred');
	});
};

function getEventByBadge(badge) {
	return new Promise((resolve, reject) => {
		Event.findOne({
			badge: badge
		}).then(resolve).catch(reject);
	});
}