global.__basedir = __dirname;

const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

const mongoose = require("./database/mongoose"); // Start mongo connection
mongoose.set('debug', true);

require("./routing/routeloader")(app); // Initializes the route loader

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
	console.log("Express is running and listening on " + port);
});