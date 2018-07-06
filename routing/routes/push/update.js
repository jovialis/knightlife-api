var apn = require("apn");

module.exports.path = "push/update";
module.exports.method = "get";

module.exports.called = function (req, res) {
	if (!require(`${__basedir}/utils/verify-request`)(req, res)) {
		res.json("Authentication failed");
		return;
	}

	var notification = new apn.Notification();
	notification.topic = 'MAD.BBN.KnightLife';
	notification.badge = 0;
	notification.contentAvailable = 1;
	notification.payload = {"type": 0};

	require(`${__basedir}/database/models/device`).find(
		function (error, object) {
			if (error) throw error;

			for (index in object) {
				let token = object[index]["token"];
				require(`${__basedir}/hooks/apn`).send(notification, token).then((result) => {
					console.log(result)
				});
			}
		}
	)

	res.json(true);
}
