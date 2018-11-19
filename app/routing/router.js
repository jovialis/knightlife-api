const express = require('express');
const bodyParser = require('body-parser');

const enforce = require('express-sslify');
const cors = require('cors');

const path = require('path');

module.exports.init = function () {
    const app = express();

    app.use(cors());
    app.use(enforce.HTTPS({ trustProtoHeader: true }));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    registerRoutes(app);

    app.use(express.static(path.join(__basedir, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__basedir + 'client/build/index.html'));
    });

    var port = process.env.PORT || 5000;
    
    app.listen(port, function () {
        console.log("Listening on port: " + port);
    });
};

function registerRoutes(app) {
    require('./routes/v1/v1-router').register(app);
    
    app.post('/api/push/refresh/events', require('./routes/v1/push/refresh/events'));
    app.post('/api/push/refresh/lunch', require('./routes/v1/push/refresh/lunch'));
    app.post('/api/push/refresh/schedule', require('./routes/v1/push/refresh/schedule'));
    app.post('/api/push/message', require('./routes/v1/push/message'));

    app.post('/api/device/register', require('./routes/v1/device/registration'));
}