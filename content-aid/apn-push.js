const apn = require("apn");

// Then: (Error)
module.exports = function(payload, then) {
    var notification = new apn.Notification();
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
                if (result.failed) {
                    console.log("Failed to send tokens: " + result);
                    then(result.failed);
                    return;
                }
                
                then(null);
            });
		}
	);
}