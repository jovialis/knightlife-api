module.exports = function(req, res) {
	if (!req.param("auth")) {
		console.log("Recieved a request with no authentication token!");
		return false;
	}

	if (req.param("auth") != process.env.REQ_VERIFICATION) {
		console.log("Failed to authenticate");
		return false;
	}

	console.log("Authenticated a request!");
	return true;
};