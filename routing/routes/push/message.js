var apn = require("apn");

module.exports.path = "push/message";
module.exports.method = "get";

module.exports.called = function (req, res) {
	if (!require(`${__basedir}/utils/verify-request`)(req, res)) {
		res.json("Authentication failed");
		return;
	}

	const message = req.param("message");
	if (!message) {
		console.log("Recieved a push message with no content");
		res.json(false);
		return;
	}

	var author = req.param("author");

	var notification = new apn.Notification();
	notification.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
	notification.sound = "ping.aiff";
	notification.alert = message;
	notification.badge = 0;
	notification.topic = "MAD.BBN.KnightLife";

	if (author) {
		notification.payload = {"author": author};
	}

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
	);

	res.json(true);
};
