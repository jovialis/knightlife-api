const apn = require("apn");
const provider = new apn.Provider(
	{
		token: {
			key: process.env.APN_KEY, // Path to the key p8 file
			keyId: process.env.APN_KEYID, // The Key ID of the p8 file (available at
			// https://developer.apple.com/account/ios/certificate/key)
			teamId: process.env.APN_TEAMID, // The Team ID of your Apple Developer Account (available at
			// https://developer.apple.com/account/#/membership/)
		},
		production: false // Set to true if sending a notification to a production iOS app
	}
);

module.exports = provider;