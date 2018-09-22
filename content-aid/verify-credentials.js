module.exports = function(req, then) {
    const username = req.body.username;
    const password = req.body.password;
    
    const DashboardUser = require(`${__basedir}/database/models/dashboarduser`);
    
    DashboardUser.findOne({
		username: username,
        password: password
	}, function (error, object) {
        if (object) {
            then(true);
        } else {
            then(false);
        }
    }
}