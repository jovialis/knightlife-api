const mongoose = require('mongoose');
const uuid = require('uuid/v4');

module.exports.registerMiddleware = (schema) => {

};

module.exports.register = (model) => {

    const ArtEventSchema = new mongoose.Schema({
        categories: {
            type: [ String ],
            default: [ 'art' ]
        }
    });

    const ArtEvent = model.discriminator('ArtEvent', ArtEventSchema);

}



