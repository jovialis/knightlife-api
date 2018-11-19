module.exports = function (req, res) {
	const formatter = require(`${__basedir}/utils/response-formatter`);

	let date = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("data"));

		res.json(formatter.error("Invalid date requested"));
		return;
	}

	let data = JSON.parse(req.param("data"));
	if (!data) {
		console.log("No data provided for submission.");

		res.json(formatter.error("No data provided"));
		return;
	}

	data["date"] = date;

	const Lunch = require(`${__basedir}/database/models/lunch`);

	const newLunchObject = new Lunch(data);
	newLunchObject.save(function(err, object) {
		if (err) {
			console.log("An error occurred: " + err);

			res.json(formatter.error("An error occurred"));
			return;
		}

		res.json(formatter.success({}, "success", date));
	})
};
