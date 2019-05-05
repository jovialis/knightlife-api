const axios = require('axios');

module.exports = function (req, res) {
	const token = req.param("device");

	if (!token) {
		console.log("Recieved a device registration request with no token!");
		res.json(false)
		return;
	}

	const version = '3.0.2';

	axios.post('https://api.bbnknightlife.com/m/device/register', {}, {
		headers: {
			Device: token,
			Version: version
		}
	});

	res.json(true);

}
