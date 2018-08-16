module.exports = function (req, res) {
	const token = req.param("device")
	if (!token) {
		console.log("Recieved a device registration request with no token!");
		res.json(false)
		return;
	}

	const Device = require(`${__basedir}/database/models/device`);
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
}
