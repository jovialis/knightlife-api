const mongoose = require('mongoose');

module.exports.init = () => {
    mongoose.connect(process.env.MONGODB_URI);

    mongoose.set('debug', true);
    
    load();
}

function load() {
    require('./models/portal/account');
    require('./models/portal/permission');

    require('./models/services/device');
    require('./models/services/user');
    require('./models/services/survey');

    require('./models/day/day');
    require('./models/day/lunch');
    require('./models/day/schedule');

    require('./models/events/event');
    
    require('./models/addons/news');
}