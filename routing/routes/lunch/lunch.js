const axios = require('axios');

module.exports = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	const date = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(require(formatter.error("Invalid date requested")));
		return
	}

	let dateString = require(`${__basedir}/utils/date-formatter`)(date);

	axios.get(`https://api.bbnknightlife.com/m/lunch/${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }`).then(res => {
		if (res.data) {
			res.json(formatter.success(res.data, "lunch", dateString));
		}
	}).catch(error => {
		console.log(error);

		res.json(formatter.error(error));
	});
};
