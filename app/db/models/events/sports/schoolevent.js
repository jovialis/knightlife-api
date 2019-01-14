const mongoose = require('mongoose');
const uuid = require('uuid/v4');

module.exports.registerMiddleware = (schema) => {

};

module.exports.register = (model) => {

    const SchoolEventSchema = new mongoose.Schema({
        categories: {
            type: [ String ],
            default: [ 'school' ]
        }
    });

    const SchoolEvent = model.discriminator('SchoolEvent', SchoolEventSchema);

}



