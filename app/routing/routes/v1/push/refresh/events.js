const apn = require("apn");

module.exports = function (req, res) {
    const formatter = require(`${__basedir}/utils/response-formatter`);

    require(`${__basedir}/content-aid/verify-credentials`)(req, function(success) {
        if (!success) {
            res.json(require(formatter.error("Invalid authentication")));
            return;
        } 
        
        const date = new Date(req.body.date);
        if (!date) {
            console.log("Invalid date requested: " + req.body.date + ".");

            res.json(require(formatter.error("Invalid date requested")));
            return
        }

        console.log("Pushing events data for date: " + date);

        const payload = {
            "type": "refresh",
            "data": {
                "date": require(`${__basedir}/utils/date-formatter`)(date),
                "target": "events"
            }
        };

        require(`${__basedir}/content-aid/apn-push`).refresh(payload, function(error) {
            if (error) {
                res.json(false);
                return;
            }

            res.json(true);
        });
    });
}
