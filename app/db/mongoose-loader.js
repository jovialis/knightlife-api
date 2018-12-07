const mongoose = require('mongoose');

module.exports.init = () => {
    mongoose.connect(process.env.MONGODB_URI);

    load();
}

function load() {
    require('./models/console/account');
    require('./models/console/permission');

    require('./models/services/device');
    require('./models/services/user');
    require('./models/services/survey');

    require('./models/day/day');
    require('./models/day/lunch');
    require('./models/day/schedule');

    require('./models/addons/event');
    require('./models/addons/news');
}