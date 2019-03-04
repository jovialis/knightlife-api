module.exports.parseDate = (req, res, next) => {
	const year = req.param('year');
	const month = req.param('month') - 1;
	const day = req.param('day');

	const date = new Date(year, month, day);
	date.setUTCHours(0,0,0,0);

	// Invalid date
	if (isNaN(date.getTime())) {
		res.status(400).send("Invalid Date Provided");
		return;
	}

	// Set date
	req.date = date;
	next();
};