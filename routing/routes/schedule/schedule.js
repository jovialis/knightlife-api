module.exports.path = "schedule";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let parsed = new Date(req.param("date"));
	if (!parsed) {
		console.log("Invalid date requested: " + req.param("data"));

		res.json(null);
		return;
	}

	//Fetch date
	require(`${__basedir}/content-aid/get-schedule`)(parsed, function(error, schedule) {
		if (!schedule) {
			res.json(null);
			return;
		}

		res.json({
			'item': schedule
		})
	});
};
