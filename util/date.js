const moment = require('moment-timezone');

const dateZone = 'US/Eastern';

module.exports.parseInEST = (string, format) => {
	const date = moment.tz(string, format, dateZone).toDate();

	// console.log(date.toUTCString());

	return date;
};

