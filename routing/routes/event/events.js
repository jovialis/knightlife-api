module.exports.path = "events";
module.exports.method = "get";

module.exports.called = function (req, res) {
	const date = Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(null);
		return
	}

	// require(`${__basedir}/database/models/lunch`).findOne({
	// 	date: date
	// }, function (error, object) {
	// 	if (error) {
	// 		console.log(error);
	// 		res.json(null);
	// 		return;
	// 	}
	//
	// 	let result = {
	// 		"menu": (object == null ? { "items": [] } : object)
	// 	};
	//
	// 	res.json(result);
	// })

	// 	let result = {
	// 		"menu": (object == null ? { "items": [] } : object)
	// 	};

	let result = {
		"items": []
	};

	res.json(result);
};
