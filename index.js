global.__basedir = __dirname;

const express = require('express');
const path = require('path');

const enforce = require('express-sslify');
const http = require('http');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(express.static(path.join(__dirname, 'client/build')));

const mongoose = require("./database/mongoose"); // Start mongo connection

require("./routing/routeloader")(app); // Initializes the route loader
require('./google/googleloader')(); // Initializes the google passport module

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

var port = process.env.PORT || 5000;
//app.listen(port, function () {
//	console.log("Express is running and listening on " + port);
//});

http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
});