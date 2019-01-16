const mongoose = require('mongoose');

module.exports.registerMiddleware = (schema) => {

};

module.exports.register = (model) => {

    const ColorWarSchema = new mongoose.Schema({
        points: {
            gold: {
                type: Number,
                default: -1
            },
            blue: {
                type: Number,
                default: -1
            },
            white: {
                type: Number,
                default: -1
            },
            black: {
                type: Number,
                default: -1
            }
        },
        categories: {
            type: [ String ],
            default: [ 'colorwars' ]
        }
    });

    const SportsGame = model.discriminator('ColorWarEvent', ColorWarSchema);

}



