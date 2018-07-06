module.exports.path = "schedule/template";
module.exports.method = "get";

module.exports.called = function (req, res) {
	require(`${__basedir}/database/models/template`).findOne(
		{},
		function (error, object) {
			if (error) {
				res.json(null)
				throw error;
			}
			res.json(object);
		}
	)
}
