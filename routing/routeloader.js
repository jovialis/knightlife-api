module.exports = function (app) {
	let files = require("./routes");
	for (let path in files) {
		const route = require("./routes/" + files[path]);

		let success = false;
		if (route.method === "get") {
			app.get("/api/" + route.path, route.called);
			success = true;
		} else if (route.method === "post") {
			app.use(bodyParser.urlencoded({
				extended: true
			}));

			app.use();

			app.post("/api/" + route.path, route.called);
			success = true;
		}

		if (success) {
			console.log(`Registered route ${route.path}`);
		}
	}
};