const express = require('express');
const bodyParser = require('body-parser');

const enforce = require('express-sslify');
const cors = require('cors');

const path = require('path');

module.exports.init = () => {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(cors());
    app.use(enforce.HTTPS({ trustProtoHeader: true }));

    register(app);

    app.use(express.static(path.join(__basedir, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__basedir + 'client/build/index.html'));
    });

    var port = process.env.PORT || 5000;

    app.listen(port, () => {
        console.log("Listening on port: " + port);
    });
};

function register(app) {
    // Console
    require('./routes/portal/post-submit-login').register(app);
}