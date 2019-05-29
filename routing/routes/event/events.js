const axios = require('axios');
const moment = require('moment');

module.exports = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	let date = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(formatter.error("Invalid date requested"));
		return;
	}

	let dateString = require(`${__basedir}/utils/date-formatter`)(date);

	axios.get(`https://api.bbnknightlife.com/m/events/${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }`).then(eventRes => {
		if (eventRes.data) {
			// Map list of events to usable ones for old versions of Knight Life.
			const convertedEvents = eventRes.data.events.map(newEvent => {
				let basicDetails = {
					date: dateString,
					description: newEvent.title
				};

				/// If it's a Block event, we convert the Block over
				if (newEvent.schedule.blocks.length !== 0) {
					basicDetails.block = newEvent.schedule.blocks[0];
				} else if (newEvent.schedule.start) {
					const startDate = moment.parseZone(newEvent.schedule.start);
					const endDate = newEvent.schedule.end ? moment.parseZone(newEvent.schedule.end) : null;

					//("0" + myNumber).slice(-2)

					// Fill in Times
					basicDetails.time = {
						start: `${ ("0" + startDate.hours()).slice(-2) }-${ ("0" + startDate.minutes()).slice(-2) }`,
						end: endDate ? ( `${ ("0" + (endDate.hours())).slice(-2) }-${ ("0" + endDate.minutes()).slice(-2) }` ) : undefined
					};
				}

				// If there is an audience specifieds
				if (newEvent.audience && newEvent.audience.length > 0) {
					basicDetails.audience = newEvent.audience.map(audience => {
						return {
							mandatory: audience.mandatory,
							grade: audience.grade + 1 // Old system has All School as 0, Freshman as 1, etc.
						};
					});
				}

				// Default Event audience
				// if (!basicDetails.audience) {
				// 	basicDetails.audience = [{
				// 		grade: 0,
				// 		mandatory: false
				// 	}];
				// }

				return basicDetails;
			});

			res.json(formatter.success(convertedEvents, "events", dateString));
		}
	}).catch(error => {
		console.log(error);

		res.json(formatter.error(error));
	});
};
