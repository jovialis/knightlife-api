const moment = require('moment-timezone');

const dateZone = 'US/Eastern';

// Set up prototype
Date.prototype.toISOString = function() {
	const date = moment(this);
	return date.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
};

module.exports.parseInEST = (string, format) => {
	return moment.tz(string, format, dateZone).toDate();
};

