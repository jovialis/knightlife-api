module.exports = function (req, res) {
	const token = req.param("device")
	if (!token) {
		console.log("Recieved a device registration request with no token!");
		res.json(false)
		return;
	}

	const Device = require(`${__basedir}/database/models/device`);
    Device.findOne({
        token: token
    }, function(err, obj) {
        if (obj) {
            res.json(true);
            return;
        }
        
        const newDevice = new Device({
            token: token
        });
        
        newDevice.save(function(err, obj) {
            if (obj) {
                res.json(true);
            } else {
                res.json(false);
            }
        });
    });
}
