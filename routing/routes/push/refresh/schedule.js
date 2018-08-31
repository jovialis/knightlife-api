var apn = require("apn");

module.exports = function (req, res) {
    const formatter = require(`${__basedir}/utils/response-formatter`);

    const date = new Date(req.body.date);
	if (!date) {
		console.log("Invalid date requested: " + req.body.date + ".");

		res.json(require(formatter.error("Invalid date requested")));
		return
	}
    
    console.log("Pushing schedule data for date: " + date);
    
    const payload = {
        "type": "refresh",
        "data": {
            "date": require(`${__basedir}/utils/date-formatter`)(date),
            "target": "schedule"
        }
    };
    
    require(`${__basedir}/content-aid/apn-push`)(payload, function(error) {
        if (error) {
            res.json(false);
            return;
        }
        
        res.json(true);
    });
}
