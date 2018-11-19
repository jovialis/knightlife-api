const mongoose = require('mongoose');

module.exports.init = function() {
    mongoose.connect(process.env.MONGODB_URI);
    
    generateModels();
}

function generateModels() {
    require('./models/dashboarduser');
    require('./models/device');
    require('./models/event');
    require('./models/lunch');
    require('./models/schedule');
    require('./models/survey');
    require('./models/template');
    require('./models/webuser');
    require('./models/vacation');
}