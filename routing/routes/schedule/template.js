module.exports = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	require(`${__basedir}/database/models/template`).findOne({}, "-_id", function (error, object) {
        if (error) {
            console.log("Could not fetch schedule template: " + error);

            res.json(formatter.error(error));
            return;
        }

        const result = object['days'];
        if (!result) {
            console.log("Template is set up incorrectly.");

            res.json(formatter.error("Could not complete request"));
            return;
        }

        res.json(formatter.success(result, "template", null));
    })
};
