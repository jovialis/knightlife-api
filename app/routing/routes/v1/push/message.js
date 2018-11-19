const apn = require("apn");

module.exports = function (req, res) {
    const formatter = require(`${__basedir}/utils/response-formatter`);

    require(`${__basedir}/content-aid/verify-credentials`)(req, function(success) {
        if (!success) {
            res.json(formatter.error("Invalid authentication"));
            return;
        } 

        const message = req.body.message;
        if (!message) {
            console.log("Recieved a push message with no content");
            res.json(false);
            return;
        }
        
        require(`${__basedir}/content-aid/apn-push`).message(message, function(error) {
            res.json(true);
        });
    });
};
