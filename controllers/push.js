const apn = require('apn');
const mongoose = require('mongoose');
const removeKey = require('key-del');

const provider = new apn.Provider({
	token: {
		key: process.env.APN_KEY, // Path to the key p8 file
		keyId: process.env.APN_KEYID, // The Key ID of the p8 file (available at
		// https://developer.apple.com/account/ios/certificate/key)
		teamId: process.env.APN_TEAMID, // The Team ID of your Apple Developer Account (available at
		// https://developer.apple.com/account/#/membership/)
	},
	production: true // Set to true if sending a notification to a production iOS app
});

module.exports.routeGlobalMessage = (req, res) => {
	const user = req.user;
	const anonymous = req.body.anonymous ? req.body.anonymous : false;
	const title = req.body.title;
	const message = req.body.message;
	const badge = req.body.badge;
	const sound = req.body.sound;
	const payload = req.body.payload;

	globalMessage(user, anonymous, title, message, badge, sound, payload).then(message => {
		let messageResult = message.toObject();
		removeKey(messageResult, [ '_id', '__v' ], { copy: false });

		res.json({
			index: messageResult
		});
	}).catch(error => {
		console.log(error);
		res.status(500).send("An Internal Error Occurred");
	});
};

module.exports.globalMessage = globalMessage;
function globalMessage(user, anonymous, title, message, badge, sound, payload) {
	return new Promise((resolve, reject) => {
		let notification = new apn.Notification();

		notification.title = title;
		notification.alert = message;

		notification.sound = sound;
		notification.badge = badge;

		notification.topic = process.env.APN_BUNDLE;

		notification.payload = {
			from: 'api-server',
			...payload
		};

		// Tag notification with user details
		if (user) {
			if (!anonymous) {
				notification.payload.sender = {
					username: user.username,
					name: user.name
				};
			}
		}

		getDeviceTokens().then(tokens => {
			provider.send(notification, tokens).then(result => {
				const sent = result.sent;
				const failed = result.failed;

				const MessagePush = mongoose.model('MessagePush');
				MessagePush.create({
					target: 'global',

					user: user._id,
					anonymous: anonymous,

					title: title,
					alert: message,

					sound: sound,
					badge: badge,

					results: {
						received: sent,
						rejected: failed
					}
				}).then(result => {
					resolve(result);
				}).catch(error => {
					reject(error);
				});
			});
		}).catch(error => {
			reject(error);
		});
	});
}

// Retrieve all device tokens
module.exports.getDeviceTokens = getDeviceTokens;
function getDeviceTokens() {
	return new Promise((resolve, reject) => {
		// Mongoose model
		const DeviceToken = mongoose.model('Device');
		// Find all Devices
		DeviceToken.find({}).then(tokens => {
			const tokenList = tokens.map(doc => doc.token);
			resolve(tokenList);
		}).catch(error => {
			reject(error);
		});
	});
}

module.exports.sendTargetedRefresh = sendTargetedRefresh;
function sendTargetedRefresh(date, target) {
	return new Promise(async (resolve, reject) => {
		let notification = new apn.Notification();
		notification.topic = 'MAD.BBN.KnightLife';
		notification.badge = 0;
		notification.contentAvailable = true;

		notification.payload = {
			"type": "refresh",
			"data": {
				"date": `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
				"target": target
			}
		};

		try {
			let tokens = await getDeviceTokens();
			provider.send(notification, tokens).then(resolve).catch(reject);
		} catch (error) {
			reject(error);
		}
	});
}
