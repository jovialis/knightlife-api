const mongoose = require('mongoose');
const uuid = require('uuid/v4');

module.exports.registerMiddleware = (schema) => {

};

module.exports.register = (model) => {

    const AllSchoolEventSchema = new mongoose.Schema({
        categories: {
            type: [ String ],
            default: [ 'school', 'school-all' ]
        }
    });

    const AllSchoolEvent = model.discriminator('AllSchoolEvent', AllSchoolEventSchema);
    
    const UpperSchoolEventSchema = new mongoose.Schema({
        categories: {
            type: [ String ],
            default: [ 'school', 'school-upper' ]
        }
    });

    const UpperSchoolEvent = model.discriminator('UpperSchoolEvent', UpperSchoolEventSchema);
    
    

}



