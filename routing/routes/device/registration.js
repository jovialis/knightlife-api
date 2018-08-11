module.exports.path = "device/register";
module.exports.method = "get";

module.exports.called = function (req, res) {
	const token = req.param("device")
	if (!token) {
		console.log("Recieved a device registration request with no token!");
		res.json(false)
		return;
	}

	const Device = require(`${__basedir}/database/models/device`)
	Device.findOne({
		token: token
	}, function (error, object) {
        if (object) {
            res.json(true);
            return;
        }
        
        const newDevice = new Device({
            token: token
        });

        newDevice.save(function(error, object) {
            if (error) {
                res.json(false);
            } else {
                res.json(true);
            }
        });
	})
}
