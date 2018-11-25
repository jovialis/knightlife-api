const apn = require("apn");

// Then: (Error)
module.exports.refresh = function(payload, then) {
    let notification = new apn.Notification();
	notification.topic = 'MAD.BBN.KnightLife';
	notification.badge = 0;
	notification.contentAvailable = 1;
	notification.payload = payload;

	require(`${__basedir}/database/models/device`).find(
		function (error, objects) {
			if (error) {
                then(error);
                return;
            }

            const apnHook = require(`${__basedir}/hooks/apn`);
            let tokenList = [];
            
            objects.forEach(function(item) {
                const token = item["token"];
                tokenList.push(token);
            });
            
            apnHook.send(notification, tokenList).then((result) => {
                if (result.failed !== undefined && result.failed.length > 0) {
                    console.log("Failed to send " + result.failed.length + " tokens.");
                }
                
                if (result.sent !== undefined) {
                    console.log("Sent " + result.sent.length + " tokens.");
                }
                
                then(null);
            });
		}
	);
}

module.exports.message = function(message, then) {
    let notification = new apn.Notification();
	notification.topic = 'MAD.BBN.KnightLife';
	notification.badge = 0;
    notification.alert = message;
    
	require(`${__basedir}/database/models/device`).find(
		function (error, objects) {
			if (error) {
                then(error);
                return;
            }

            const apnHook = require(`${__basedir}/hooks/apn`);
            let tokenList = [];
            
            objects.forEach(function(item) {
                const token = item["token"];
                tokenList.push(token);
            });
            
            apnHook.send(notification, tokenList).then((result) => {
                if (result.failed !== undefined && result.failed.length > 0) {
                    console.log("Failed to send " + result.failed.length + " tokens.");
                }
                
                if (result.sent !== undefined) {
                    console.log("Sent " + result.sent.length + " tokens.");
                }
                
                then(null);
            });
		}
	);
}

