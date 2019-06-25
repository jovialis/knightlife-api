const mongoose = require('mongoose');
const ical = require('ical-toolkit');
const download = require('download');
const dates = require('../util/date');

require('../models/modeller').init();

async function fetchUpdates() {
	const url = 'https://www.bbns.org/calendar/calendar_354.ics';

	const raw = await download(url);
	const ics = await ical.parseToJSON(raw);

	try {
		await handleICS(ics);
	} catch (err) {
		console.log(err);
	}
}

async function handleICS(ics) {
	const Event = mongoose.model('Event');

	if (ics['VCALENDAR'] === undefined || ics['VCALENDAR'][0]['VEVENT'] === undefined) {
		console.log(`Found no events for school calendar.`);
		return;
	}

	for (const event of ics['VCALENDAR'][0]['VEVENT']) {
		event['DTSTAMP'] = undefined;
		const raw = JSON.stringify(event);

		const badge = event['UID'];

		console.log(`Fetched event ${ badge }.`);

		const eventDocument = await Event.findOne({
			badge: badge
		});

		try {
			// Event already in system
			if (eventDocument) {
				// Raw data isn't the same
				if (eventDocument.calendarRaw !== raw) {
					const digested = digestEvent(event);

					try {
						for (const key in digested) {
							eventDocument[key] = digested[key];
						}

						eventDocument.calendarRaw = raw;

						await eventDocument.save();

						console.log(`Updated arts event ${badge}`);
					} catch (err) {
						console.log(err);
					}
				}
			} else {
				const digested = digestEvent(event);

				if (digested === undefined) {
					//                    console.log('Recieved an unparsable event.');
					continue;
				}

				try {
					await mongoose.model('ArtsEvent').create(digested);

					console.log(`Created arts event ${badge}`);
				} catch (err) {
					console.log(err);
				}
			}
		} catch (err) {
			console.log(err);
		}
	}
}

function digestEvent(event) {
	let output = {
		schedule: {}
	};

	output.badge = event['UID'];

	const dateFormat = 'YYYYMMDD HHmmss';

	// Invalid event if it doesn't have a date.
	if (event['DTSTART'] === undefined && event['DTSTART;VALUE=DATE'] === undefined) {
		console.log(`Recieved an invalid event.`);
		return;
	}

	output.schedule.start = event['DTSTART'] ? (dates.parseInEST(event['DTSTART'], dateFormat)) : null;
	output.schedule.end = event['DTEND'] ? (dates.parseInEST(event['DTEND'], dateFormat)) : null;

	const start = output.schedule.start;

	if (start === null) {
		output.date = dates.parseInEST(event['DTSTART;VALUE=DATE'], 'YYYYMMDD');
	} else {
		output.date = new Date(start.getFullYear(), start.getMonth(), start.getDate());
	}

	output.calendarRaw = JSON.stringify(event);

	output.title = event['SUMMARY'];
	output.location = event['LOCATION'];

	return output;
}

console.log("Updating Arts events...");
const start = new Date();

fetchUpdates().then(() => {
	console.log(`Finished updating Arts events in ${ new Date() - start }ms...`);
	process.exit();
});